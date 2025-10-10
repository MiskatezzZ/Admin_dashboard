import { NextResponse } from 'next/server';
import { db } from "../../config/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as fbLimit,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

export const runtime = 'nodejs';

// GET /api/bookings?status=&limit=
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const coll = (searchParams.get('collection') || 'bookings').trim();
    const orderField = (searchParams.get('orderBy') || 'createdAt').trim();

    const constraints = [];
    if (status) constraints.push(where('status', '==', status));
    constraints.push(orderBy(orderField, 'desc'));
    constraints.push(fbLimit(limit));
    const colRef = collection(db, coll);

    // Try main order field; if it fails (e.g., field missing in documents), try 'date', then 'bookingDate'; else no order
    let snap;
    try {
      snap = await getDocs(query(colRef, ...constraints));
    } catch (err) {
      try {
        const altConstraints = constraints
          .filter(c => !('field' in c) || c.field?.path !== orderField)
          .map(c => c);
        altConstraints.unshift(orderBy('date', 'desc'));
        snap = await getDocs(query(colRef, ...altConstraints));
      } catch (err2) {
        try {
          const alt2 = constraints
            .filter(c => !('field' in c) || c.field?.path !== orderField)
            .map(c => c);
          alt2.unshift(orderBy('bookingDate', 'desc'));
          snap = await getDocs(query(colRef, ...alt2));
        } catch (err3) {
        // Final fallback: no orderBy
          const baseConstraints = constraints.filter(c => c.constructor?.name !== 'OrderBy');
          snap = await getDocs(query(colRef, ...baseConstraints));
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

    return NextResponse.json({ success: true, data, total: data.length, limit, collection: coll });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch bookings', error: error?.message }, { status: 500 });
  }
}

// POST /api/bookings
export async function POST(request) {
  try {
    const body = await request.json();
    const nowIso = new Date().toISOString();

    const payload = {
      name: body.name || body.studentName || '',
      email: body.email || '',
      phone: body.phone || '',
      status: body.status || 'pending',
      bookingDate: body.bookingDate || nowIso,
      createdAt: nowIso,
      notes: body.notes || '',
    };

    const ref = await addDoc(collection(db, 'bookings'), payload);
    return NextResponse.json({ success: true, message: 'Booking created', data: { id: ref.id, ...payload } });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create booking', error: error?.message }, { status: 500 });
  }
}

// PUT /api/bookings
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body || {};
    if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 });

    delete updates.createdAt;
    updates.updatedAt = new Date().toISOString();

    await updateDoc(doc(collection(db, 'bookings'), String(id)), updates);

    return NextResponse.json({ success: true, message: 'Booking updated' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update booking', error: error?.message }, { status: 500 });
  }
}

// DELETE /api/bookings
export async function DELETE(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id } = body || {};
    if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 });

    await deleteDoc(doc(collection(db, 'bookings'), String(id)));

    return NextResponse.json({ success: true, message: 'Booking deleted', id });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete booking', error: error?.message }, { status: 500 });
  }
}
