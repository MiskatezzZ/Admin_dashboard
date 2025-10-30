import { NextResponse } from 'next/server';
import { db } from "../../../../../config/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const { userId, applicationId } = await params;
    
    if (!userId || !applicationId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing userId or applicationId' 
      }, { status: 400 });
    }

    // Fetch the specific application document
    const appRef = doc(db, 'users', userId, 'applications', applicationId);
    const appSnap = await getDoc(appRef);

    if (!appSnap.exists()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Application not found' 
      }, { status: 404 });
    }

    const appData = appSnap.data();

    // Helper to convert arrays
    const asArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.filter(Boolean);
      if (typeof val === 'string') return [val];
      return [];
    };

    // Helper to check file types
    const isPdfUrl = (u) => /\.pdf(?:\?.*)?$/i.test(u || '');
    const isImageUrl = (u) => /\.(png|jpe?g|gif|webp|svg|bmp|ico|tiff?|heic|heif)(?:\?.*)?$/i.test(u || '');

    // Collect PDFs and images from uploads
    const collectFromUploads = (uploads) => {
      const acc = { pdfs: [], images: [] };
      if (!uploads || typeof uploads !== 'object') return acc;
      
      const pushUrl = (url, type) => {
        if (typeof url !== 'string' || !url) return;
        const t = (type || '').toString().toLowerCase();
        if (t.includes('pdf') || isPdfUrl(url)) {
          acc.pdfs.push(url);
        } else if (t.includes('image') || isImageUrl(url)) {
          acc.images.push(url);
        } else if (isPdfUrl(url)) {
          acc.pdfs.push(url);
        } else {
          acc.images.push(url);
        }
      };

      for (const key of Object.keys(uploads)) {
        const v = uploads[key];
        if (typeof v === 'string') {
          pushUrl(v);
        } else if (Array.isArray(v)) {
          v.forEach(it => {
            if (typeof it === 'string') {
              pushUrl(it);
            } else if (it && typeof it === 'object') {
              pushUrl(it.url, it.type || it.contentType);
            }
          });
        } else if (v && typeof v === 'object') {
          pushUrl(v.url, v.type || v.contentType);
        }
      }
      return acc;
    };

    const upData = collectFromUploads(appData.uploads);

    // Collect all PDFs
    const pdfs = Array.from(new Set([
      ...asArray(appData.pdfs),
      ...asArray(appData.pdfUrls),
      ...asArray(appData.pdfUrl),
      ...(appData.attachments ? asArray(appData.attachments.pdfs) : []),
      ...upData.pdfs,
    ].filter(Boolean)));

    // Collect all images
    const images = Array.from(new Set([
      ...asArray(appData.images),
      ...asArray(appData.imageUrls),
      ...asArray(appData.imageUrl),
      ...(appData.attachments ? asArray(appData.attachments.images) : []),
      ...(appData.photos ? asArray(appData.photos) : []),
      ...upData.images,
    ].filter(Boolean)));

    // Convert Firestore timestamps to ISO strings
    const toIso = (v) => {
      if (!v) return null;
      if (typeof v.toDate === 'function') return v.toDate().toISOString();
      try {
        return new Date(v).toISOString();
      } catch {
        return null;
      }
    };

    // Build the response with all application data
    const application = {
      id: appSnap.id,
      ...appData,
      // Override timestamps with ISO strings
      createdAt: toIso(appData.createdAt),
      updatedAt: toIso(appData.updatedAt),
      submittedAt: toIso(appData.submittedAt),
      appliedAt: toIso(appData.createdAt || appData.submittedAt || appData.date),
      date: toIso(appData.date),
      // Add organized attachments
      pdfs,
      images,
    };

    return NextResponse.json({ 
      success: true, 
      application 
    });

  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch application', 
      error: error?.message 
    }, { status: 500 });
  }
}
