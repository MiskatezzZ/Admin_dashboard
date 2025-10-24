import { NextResponse } from 'next/server';
import { db } from "../../config/firebaseConfig";
import { collectionGroup, collection, getDocs, query, orderBy, limit as fbLimit } from 'firebase/firestore';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);
    const orderField = (searchParams.get('orderBy') || 'createdAt').trim();
    const userId = (searchParams.get('userId') || '').trim();

    let snap;
    if (userId) {
      const col = collection(db, 'users', userId, 'bookings');
      try {
        snap = await getDocs(query(col, orderBy(orderField, 'desc'), fbLimit(limit)));
      } catch (err1) {
        try {
          snap = await getDocs(query(col, orderBy('bookingDate', 'desc'), fbLimit(limit)));
        } catch (err2) {
          try {
            snap = await getDocs(query(col, orderBy('date', 'desc'), fbLimit(limit)));
          } catch (err3) {
            snap = await getDocs(query(col, fbLimit(limit)));
          }
        }
      }
    } else {
      const cg = collectionGroup(db, 'bookings');
      try {
        snap = await getDocs(query(cg, orderBy(orderField, 'desc'), fbLimit(limit)));
      } catch (err1) {
        try {
          snap = await getDocs(query(cg, orderBy('bookingDate', 'desc'), fbLimit(limit)));
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

    const data = snap.docs.map(d => {
      const x = d.data();
      return {
        id: d.id,
        path: d.ref.path,
        userId: d.ref.parent?.parent?.id || '',
        name: x.name || x.studentName || x.user?.name || '',
        email: x.email || x.user?.email || '',
        phone: x.phone || x.user?.phone || '',
        status: x.status || 'pending',
        bookingDate: toIso(x.bookingDate) || toIso(x.date) || toIso(x.createdAt),
        createdAt: toIso(x.createdAt) || toIso(x.date),
        slot: x.slot || '',
        notes: x.notes || '',
      };
    });

    return NextResponse.json({ success: true, data, total: data.length, limit });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch user bookings', error: error?.message }, { status: 500 });
  }
}
