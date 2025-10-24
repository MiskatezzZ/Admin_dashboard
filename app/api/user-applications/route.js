import { NextResponse } from 'next/server';
import { db } from "../../config/firebaseConfig";
import { collectionGroup, collection, getDocs, query, orderBy, limit as fbLimit } from 'firebase/firestore';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 300);
    const orderField = (searchParams.get('orderBy') || 'createdAt').trim();

    const userId = (searchParams.get('userId') || '').trim();

    let snap;
    if (userId) {
      const col = collection(db, 'users', userId, 'applications');
      try {
        snap = await getDocs(query(col, orderBy(orderField, 'desc'), fbLimit(limit)));
      } catch (err1) {
        try {
          snap = await getDocs(query(col, orderBy('submittedAt', 'desc'), fbLimit(limit)));
        } catch (err2) {
          try {
            snap = await getDocs(query(col, orderBy('date', 'desc'), fbLimit(limit)));
          } catch (err3) {
            snap = await getDocs(query(col, fbLimit(limit)));
          }
        }
      }
    } else {
      const cg = collectionGroup(db, 'applications');
      try {
        snap = await getDocs(query(cg, orderBy(orderField, 'desc'), fbLimit(limit)));
      } catch (err1) {
        try {
          snap = await getDocs(query(cg, orderBy('submittedAt', 'desc'), fbLimit(limit)));
        } catch (err2) {
          try {
            snap = await getDocs(query(cg, orderBy('date', 'desc'), fbLimit(limit)));
          } catch (err3) {
            snap = await getDocs(query(cg, fbLimit(limit)));
          }
        }
      }
    }

    const toIso = (v) => {
      if (!v) return null;
      if (typeof v.toDate === 'function') return v.toDate().toISOString();
      try { return new Date(v).toISOString(); } catch { return null; }
    };

    const asArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.filter(Boolean);
      if (typeof val === 'string') return [val];
      return [];
    };

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

    const data = snap.docs.map(d => {
      const x = d.data();
      const up = collectFromUploads(x.uploads);
      const pdfs = [
        ...asArray(x.pdfs),
        ...asArray(x.pdfUrls),
        ...asArray(x.pdfUrl),
        ...(x && x.attachments ? asArray(x.attachments.pdfs) : []),
        ...up.pdfs,
      ].filter(Boolean);
      const images = [
        ...asArray(x.images),
        ...asArray(x.imageUrls),
        ...asArray(x.imageUrl),
        ...(x && x.attachments ? asArray(x.attachments.images) : []),
        ...(x && x.photos ? asArray(x.photos) : []),
        ...up.images,
      ].filter(Boolean);

      return {
        id: d.id,
        path: d.ref.path,
        userId: d.ref.parent?.parent?.id || '',
        name: x.name || x.applicantName || x.user?.name || '',
        email: x.email || x.user?.email || '',
        phone: x.phone || x.user?.phone || '',
        status: x.status || 'pending',
        appliedAt: toIso(x.createdAt) || toIso(x.submittedAt) || toIso(x.date),
        createdAt: toIso(x.createdAt) || toIso(x.date),
        pdfs,
        images,
      };
    });

    return NextResponse.json({ success: true, data, total: data.length, limit });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch applications', error: error?.message }, { status: 500 });
  }
}
