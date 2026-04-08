import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Mock database - replace with real MongoDB later
const users: Record<string, any> = {};
const otps: Record<string, { code: string; timestamp: number }> = {};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function createUser(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    if (users[email]) {
      return res.status(409).json({ message: 'User already exists' });
    }

    users[email] = {
      id: Date.now().toString(),
      email,
      password, // In production, hash this!
      name: name || '',
      createdAt: new Date(),
    };

    const token = jwt.sign(
      { userId: users[email].id, email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as any
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: users[email].id,
        email,
        name: users[email].name,
      },
    });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = users[email];

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as any
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function verifyToken(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, decoded });
  } catch (err) {
    console.error('Verify token error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
}

export async function sendOtp(req: Request, res: Response) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone is required' });
    }

    // Generate 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP temporarily (5 minutes validity)
    otps[phone] = {
      code: otpCode,
      timestamp: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    console.log(`[OTP] Sent to ${phone}: ${otpCode}`);

    res.json({
      success: true,
      phone,
      message: 'OTP sent successfully',
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP required' });
    }

    const otpRecord = otps[phone];

    if (!otpRecord || otpRecord.code !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if OTP expired
    if (Date.now() > otpRecord.timestamp) {
      delete otps[phone];
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Delete OTP after verification
    delete otps[phone];

    // Create or find user
    let user = users[phone];
    if (!user) {
      user = users[phone] = {
        id: Date.now().toString(),
        phone,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        name: `User ${phone}`,
        createdAt: new Date(),
      };
    }

    const token = jwt.sign(
      { userId: user.id, phone, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as any
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
