import { NextResponse } from 'next/server';
import { db } from "../../../config/firebaseConfig";
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    if (!userId) return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });

    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    const x = snap.data() || {};

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

    const toIso = (v) => {
      if (!v) return null;
      if (typeof v.toDate === 'function') return v.toDate().toISOString();
      try { return new Date(v).toISOString(); } catch { return null; }
    };

    // Fetch user's applications with ordering fallbacks
    let appSnap;
    const col = collection(db, 'users', userId, 'applications');
    try {
      appSnap = await getDocs(query(col, orderBy('createdAt', 'desc')));
    } catch (e1) {
      try {
        appSnap = await getDocs(query(col, orderBy('submittedAt', 'desc')));
      } catch (e2) {
        try {
          appSnap = await getDocs(query(col, orderBy('date', 'desc')));
        } catch (e3) {
          appSnap = await getDocs(query(col));
        }
      }
    }

    const apps = (appSnap?.docs || []).map(d => {
      const a = d.data() || {};
      const upA = collectFromUploads(a.uploads);
      const createdAt = toIso(a.createdAt);
      const submittedAt = toIso(a.submittedAt);
      const dateFallback = toIso(a.date);
      const appliedAt = createdAt || submittedAt || dateFallback;
      const pdfs = [
        ...asArray(a.pdfs),
        ...asArray(a.pdfUrls),
        ...asArray(a.pdfUrl),
        ...(a && a.attachments ? asArray(a.attachments.pdfs) : []),
        ...upA.pdfs,
      ].filter(Boolean);
      const images = [
        ...asArray(a.images),
        ...asArray(a.imageUrls),
        ...asArray(a.imageUrl),
        ...(a && a.attachments ? asArray(a.attachments.images) : []),
        ...(a && a.photos ? asArray(a.photos) : []),
        ...upA.images,
      ].filter(Boolean);
      return {
        id: d.id,
        path: d.ref.path,
        form: a.form || a.category || '',
        status: a.status || 'pending',
        createdAt,
        submittedAt,
        appliedAt,
        date: dateFallback,
        pdfs,
        images,
      };
    });

    // Aggregate attachments from user doc + applications
    const up = collectFromUploads(x.uploads);
    const agg = apps.reduce((acc, a) => {
      if (Array.isArray(a.pdfs)) acc.pdfs.push(...a.pdfs);
      if (Array.isArray(a.images)) acc.images.push(...a.images);
      return acc;
    }, { pdfs: [...up.pdfs, ...asArray(x.pdfs), ...asArray(x.pdfUrls), ...asArray(x.pdfUrl), ...(x.attachments ? asArray(x.attachments.pdfs) : [])],
          images: [...up.images, ...asArray(x.images), ...asArray(x.imageUrls), ...asArray(x.imageUrl), ...(x.attachments ? asArray(x.attachments.images) : []), ...(x.photos ? asArray(x.photos) : [])] });

    const attachments = {
      pdfs: Array.from(new Set(agg.pdfs.filter(Boolean))),
      images: Array.from(new Set(agg.images.filter(Boolean)))
    };

    const userData = {
      id: snap.id,
      ...x,
      createdAt: toIso(x.createdAt),
      updatedAt: toIso(x.updatedAt),
    };

    return NextResponse.json({ success: true, user: userData, attachments, applications: apps });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch user', error: error?.message }, { status: 500 });
  }
}