// Exams API backed by Firestore
import { NextResponse } from 'next/server'
import { db } from "../../config/firebaseConfig"
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit as fbLimit,
  doc,
  deleteDoc,
} from 'firebase/firestore'

type Exam = {
  id?: string
  title: string
  type: string
  examDate?: string
  applicationStart?: string
  applicationEnd?: string
  published?: boolean
  createdAt?: string
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/exams - Get all exam notifications from Firestore
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100', 10), 200)
    const qRef = query(collection(db, 'exams'), orderBy('createdAt', 'desc'), fbLimit(limit))
    const snap = await getDocs(qRef)
    const data: Exam[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Exam, 'id'>) }))
    return NextResponse.json({ success: true, data, total: data.length, limit })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch exams', error: error?.message }, { status: 500 })
  }
}

// POST /api/exams - Create new exam notification in Firestore
export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<Exam>
    if (!body?.type) return NextResponse.json({ success: false, message: 'type is required' }, { status: 400 })
    const nowIso = new Date().toISOString()
    const payload = {
      title: body.title || body.type!,
      type: body.type!,
      examDate: body.examDate || '',
      applicationStart: body.applicationStart || '',
      applicationEnd: body.applicationEnd || '',
      published: body.published ?? true,
      createdAt: body.createdAt || nowIso,
    }
    const ref = await addDoc(collection(db, 'exams'), payload)
    return NextResponse.json({ success: true, message: 'Exam notification created successfully', data: { id: ref.id, ...payload } })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to create exam notification', error: error.message }, { status: 500 })
  }
}

// DELETE /api/exams - Delete exam notification by Firestore doc id
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json() as { id?: string }
    if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 })
    await deleteDoc(doc(collection(db, 'exams'), String(id)))
    return NextResponse.json({ success: true, message: 'Exam notification deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to delete exam notification', error: error.message }, { status: 500 })
  }
}
