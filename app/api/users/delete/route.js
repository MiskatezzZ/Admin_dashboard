import { NextResponse } from 'next/server'
import { db } from "../../../config/firebaseConfig"
import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore'

export const runtime = 'nodejs'

export async function DELETE(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { userId } = body || {}

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ success: false, message: 'Missing or invalid userId' }, { status: 400 })
    }

    // Delete all applications for this user
    const applicationsRef = collection(db, 'users', userId, 'applications')
    const applicationsSnap = await getDocs(applicationsRef)
    
    const deletePromises = []
    applicationsSnap.docs.forEach(doc => {
      deletePromises.push(deleteDoc(doc.ref))
    })

    // Delete all bookings for this user
    const bookingsRef = collection(db, 'users', userId, 'bookings')
    const bookingsSnap = await getDocs(bookingsRef)
    
    bookingsSnap.docs.forEach(doc => {
      deletePromises.push(deleteDoc(doc.ref))
    })

    // Wait for all subcollections to be deleted
    await Promise.all(deletePromises)

    // Delete the user document itself
    const userRef = doc(db, 'users', userId)
    await deleteDoc(userRef)

    return NextResponse.json({ 
      success: true, 
      message: 'User and all associated data deleted successfully',
      deletedApplications: applicationsSnap.docs.length,
      deletedBookings: bookingsSnap.docs.length
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete user', 
      error: error?.message 
    }, { status: 500 })
  }
}
