import { NextResponse } from 'next/server'
import { db } from "../../../config/firebaseConfig"
import { doc, updateDoc, getDoc, collection } from 'firebase/firestore'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { path, userId, id } = body || {}

    let ref
    if (path && typeof path === 'string') {
      ref = doc(db, ...path.split('/'))
    } else if (userId && id) {
      ref = doc(collection(db, 'users', userId, 'applications'), id)
    } else {
      return NextResponse.json({ success: false, message: 'Provide either { path } or { userId, id }' }, { status: 400 })
    }

    const snap = await getDoc(ref)
    if (!snap.exists()) return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 })

    const current = snap.data() || {}
    const nextStatus = current.status === 'pending' ? 'seen' : (current.status || 'seen')

    await updateDoc(ref, { status: nextStatus, updatedAt: new Date() })

    return NextResponse.json({ success: true, message: 'Updated', id: ref.id, path: ref.path, status: nextStatus })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update application status', error: error?.message }, { status: 500 })
  }
}
