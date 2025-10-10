// API Route for User Management
// Backend friend can implement actual database logic here

import { NextResponse } from 'next/server'
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
} from 'firebase/firestore'

// GET /api/users - Get users from Firestore with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const course = searchParams.get('course') || undefined
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 100)

    const constraints = []
    if (status) constraints.push(where('status', '==', status))
    if (course) constraints.push(where('course', '==', course))
    // Order by createdAt if present; if not, Firestore will still return docs
    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(fbLimit(limit))

    const qRef = query(collection(db, 'users'), ...constraints)
    const snap = await getDocs(qRef)

    const toIso = (v) => {
      if (!v) return null
      if (typeof v.toDate === 'function') return v.toDate().toISOString()
      try { return new Date(v).toISOString() } catch { return null }
    }

    const data = snap.docs.map(d => {
      const x = d.data()
      return {
        id: d.id,
        name: x.name || '',
        email: x.email || '',
        course: x.course || '',
        enrolledDate: toIso(x.enrolledDate) || toIso(x.createdAt) || null,
        status: x.status || 'active',
        grade: x.grade || '',
        phone: x.phone || '',
      }
    })

    return NextResponse.json({ success: true, data, total: data.length, page: 1, limit, totalPages: 1 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch users', error: error?.message }, { status: 500 })
  }
}

// POST /api/users - Create new student enrollment
export async function POST(request) {
  try {
    const body = await request.json()
    const nowIso = new Date().toISOString()

    const payload = {
      name: body.name || '',
      email: body.email || '',
      course: body.course || '',
      status: body.status || 'active',
      grade: body.grade || '',
      phone: body.phone || '',
      enrolledDate: body.enrolledDate || nowIso,
      createdAt: nowIso,
    }

    const ref = await addDoc(collection(db, 'users'), payload)
    return NextResponse.json({ success: true, message: 'Student enrolled successfully', data: { id: ref.id, ...payload } })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to enroll student',
      error: error.message
    }, { status: 500 })
  }
}

// DELETE /api/users - Delete a student (stub)
// Body: { id: number | string }
export async function DELETE(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { id } = body || {}

    if (id === undefined || id === null) {
      return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 })
    }

    await deleteDoc(doc(collection(db, 'users'), String(id)))

    return NextResponse.json({ success: true, message: 'Deleted', id })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete student', error: error.message }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update student information
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body || {}
    if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 })

    // Prevent overwriting createdAt; update updatedAt
    delete updates.createdAt
    updates.updatedAt = new Date().toISOString()

    await updateDoc(doc(collection(db, 'users'), String(id)), updates)

    return NextResponse.json({ success: true, message: 'Student information updated successfully' })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update student information',
      error: error.message
    }, { status: 500 })
  }
}
