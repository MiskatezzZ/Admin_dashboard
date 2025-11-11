// Exams API with simple JSON file persistence
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

type Exam = {
  id: number
  title: string
  type: string
  examDate?: string
  applicationStart?: string
  applicationEnd?: string
  published?: boolean
  createdAt?: string
}

const dataPath = path.join(process.cwd(), 'data', 'exams.json')

// Ensure Node.js runtime and disable caching for dynamic read/write
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function readExams(): Promise<Exam[]> {
  try {
    const raw = await fs.readFile(dataPath, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed as Exam[] : []
  } catch (e: any) {
    if (e?.code === 'ENOENT') {
      await fs.mkdir(path.dirname(dataPath), { recursive: true })
      await fs.writeFile(dataPath, '[]', 'utf-8')
      return []
    }
    throw e
  }
}

async function writeExams(exams: Exam[]) {
  await fs.writeFile(dataPath, JSON.stringify(exams, null, 2), 'utf-8')
}

// GET /api/exams - Get all exam notifications
export async function GET() {
  const data = await readExams()
  return NextResponse.json({ success: true, data, total: data.length })
}

// POST /api/exams - Create new exam notification
export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<Exam>
    if (!body?.type) return NextResponse.json({ success: false, message: 'type is required' }, { status: 400 })
    const now = Date.now()
    const exam: Exam = {
      id: now,
      title: body.title || body.type!,
      type: body.type!,
      examDate: body.examDate,
      applicationStart: body.applicationStart,
      applicationEnd: body.applicationEnd,
      published: body.published ?? true,
      createdAt: new Date(now).toISOString()
    }
    const list = await readExams()
    list.unshift(exam)
    await writeExams(list)
    return NextResponse.json({ success: true, message: 'Exam notification created successfully', data: exam })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to create exam notification', error: error.message }, { status: 500 })
  }
}

// DELETE /api/exams/[id] - Delete exam notification
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json() as { id?: number }
    if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 })
    const list = await readExams()
    const next = list.filter(x => x.id !== id)
    await writeExams(next)
    return NextResponse.json({ success: true, message: 'Exam notification deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to delete exam notification', error: error.message }, { status: 500 })
  }
}
