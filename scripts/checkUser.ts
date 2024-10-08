import dbConnect from '../src/lib/db'
import User from '../src/models/User'

async function checkUser() {
  try {
    await dbConnect()
    console.log('Connected to database')

    const user = await User.findOne({ email: 'testuser@example.com' })
    if (user) {
      console.log('User found:', user)
    } else {
      console.log('User not found')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    process.exit()
  }
}

checkUser()