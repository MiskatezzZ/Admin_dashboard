import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { db } from "../../config/firebaseConfig";
import { collection, addDoc, getDocs, query, orderBy, limit as fbLimit, where, doc, deleteDoc } from "firebase/firestore";

export const runtime = 'nodejs';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req) {
   try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate that the file is actually a PDF by checking the magic number
    const isPDF = buffer.slice(0, 5).toString() === '%PDF-';
    if (!isPDF) {
      return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
    }

    // Normalize filename to ensure it has a .pdf extension (case-insensitive)
    const rawName = typeof file.name === 'string' && file.name.length > 0 ? file.name : 'document.pdf';
    const hasPdfExt = /\.pdf$/i.test(rawName);
    const normalizedName = hasPdfExt ? rawName : `${rawName.replace(/\.[^/.]+$/, '')}.pdf`;
    const publicIdBase = normalizedName.replace(/\.pdf$/i, '');

    // Upload via data URI to avoid stream issues
    const dataUri = `data:application/pdf;base64,${buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'resources',
      resource_type: 'raw',
      type: 'upload',
      format: 'pdf',
      public_id: publicIdBase,
      use_filename: false,
      unique_filename: false,
      overwrite: false,
    });
    console.log('Cloudinary upload result', {
      resource_type: result?.resource_type,
      format: result?.format,
      bytes: result?.bytes,
      secure_url: result?.secure_url,
      url: result?.url,
    });

    // Store file details in Firebase
    await addDoc(collection(db, "pdfs"), {
      title: normalizedName,
      url: result.secure_url,
      uploadedAt: new Date(),
      fileType: 'application/pdf',
      size: file.size,
    });
    return NextResponse.json({ success: true, result });
   } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Upload failed' }, { status: 500 });
   }
}

// Helper to derive Cloudinary public_id from a direct URL
function extractPublicIdFromUrl(url) {
  try {
    // Matches .../(raw|image)/upload/v<digits>/<public_id>[.ext]
    const u = new URL(url);
    const parts = u.pathname.split('/');
    const uploadIdx = parts.findIndex(p => p === 'upload');
    if (uploadIdx === -1 || uploadIdx + 2 >= parts.length) return null;
    // After 'upload', next segment is version (v123...), remaining joined is public_id (may include folders and dot in name)
    const pidParts = parts.slice(uploadIdx + 2);
    const publicPath = decodeURIComponent(pidParts.join('/'));
    // Keep extension if present
    return publicPath;
  } catch {
    return null;
  }
}

// GET /api/resources?limit=24
// Lists uploaded PDFs stored in Firestore collection "pdfs"
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limRaw = parseInt(searchParams.get('limit') || '24', 10);
    const lim = Number.isFinite(limRaw) ? Math.min(Math.max(limRaw, 1), 100) : 24;

    const qRef = query(collection(db, 'pdfs'), orderBy('uploadedAt', 'desc'), fbLimit(lim));
    const snap = await getDocs(qRef);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ items });
  } catch (e) {
    console.error('[Resources GET] error', e);
    return NextResponse.json({ error: e?.message || 'Failed to fetch PDFs' }, { status: 500 });
  }
}

// DELETE /api/resources
// Body JSON: { public_id?: string, url?: string, docId?: string }
export async function DELETE(req) {
  try {
    const body = await req.json().catch(() => ({}));
    let { public_id, url, docId } = body || {};

    if (!public_id && url) {
      public_id = extractPublicIdFromUrl(url);
    }

    let cloudinaryResult = null;
    if (public_id) {
      // Try raw first, then image fallback
      cloudinaryResult = await cloudinary.uploader.destroy(public_id, { resource_type: 'raw', type: 'upload' });
      if (cloudinaryResult?.result !== 'ok') {
        cloudinaryResult = await cloudinary.uploader.destroy(public_id, { resource_type: 'image', type: 'upload' });
      }
    }

    let firestoreResult = null;
    if (docId) {
      await deleteDoc(doc(collection(db, 'pdfs'), docId));
      firestoreResult = { deleted: docId };
    } else if (url) {
      // Attempt best-effort deletion by URL match
      const qRef = query(collection(db, 'pdfs'), where('url', '==', url), fbLimit(1));
      const snap = await getDocs(qRef);
      if (!snap.empty) {
        const d = snap.docs[0];
        await deleteDoc(d.ref);
        firestoreResult = { deleted: d.id };
      }
    }

    return NextResponse.json({ success: true, cloudinaryResult, firestoreResult });
  } catch (e) {
    console.error('[Resources DELETE] error', e);
    return NextResponse.json({ success: false, error: e?.message || 'Failed to delete resource' }, { status: 500 });
  }
}