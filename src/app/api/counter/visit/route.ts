import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const COUNTER_FILE = path.join(process.cwd(), 'data', 'visitor_count.json');

function getCount(): number {
  try {
    if (fs.existsSync(COUNTER_FILE)) {
      return JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf-8')).count || 0;
    }
  } catch {}
  return 0;
}

function incrementCount(): number {
  const next = getCount() + 1;
  try {
    const dir = path.dirname(COUNTER_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: next }));
  } catch {}
  return next;
}

export async function GET() {
  return NextResponse.json({ count: getCount() });
}

export async function POST() {
  return NextResponse.json({ count: incrementCount() });
}
