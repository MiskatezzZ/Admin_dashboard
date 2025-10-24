import { NextResponse } from 'next/server';
import { db } from "../../../config/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    if (!userId) return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });

    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    const x = snap.data() || {};

    const isPdfUrl = (u) => /\.pdf(?:\?.*)?$/i.test(u || '');
    const isImageUrl = (u) => /\.(png|jpe?g|gif|webp|svg|bmp|ico|tiff?|heic|heif)(?:\?.*)?$/i.test(u || '');

    const collectFromUploads = (uploads) => {
      const acc = { pdfs: [], images: [] };
      if (!uploads || typeof uploads !== 'object') return acc;
      const pushUrl = (url, type) => {
        if (typeof url !== 'string' || !url) return;
        const t = (type || '').toString().toLowerCase();
        if (t.includes('pdf') || isPdfUrl(url)) acc.pdfs.push(url);
        else if (t.includes('image') || isImageUrl(url)) acc.images.push(url);
        else if (isPdfUrl(url)) acc.pdfs.push(url);
        else acc.images.push(url);
      };
      for (const key of Object.keys(uploads)) {
        const v = uploads[key];
        if (typeof v === 'string') { pushUrl(v); continue; }
        if (Array.isArray(v)) { v.forEach(it => { if (typeof it === 'string') pushUrl(it); else if (it && typeof it === 'object') pushUrl(it.url, it.type || it.contentType); }); continue; }
        if (v && typeof v === 'object') { pushUrl(v.url, v.type || v.contentType); }
      }
      return acc;
    };

    const attachments = collectFromUploads(x.uploads);

    return NextResponse.json({ success: true, user: { id: snap.id, ...x }, attachments });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch user', error: error?.message }, { status: 500 });
  }
}
