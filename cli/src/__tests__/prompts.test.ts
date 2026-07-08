import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const projectNameSchema = z.string()
  .min(1, 'Project name is required')
  .regex(/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$|^\.$/, 'Invalid project name');

function getOrmOptions(database: string) {
  const options: { value: string; label: string }[] = [];
  if (database === 'mongodb') {
    options.push({ value: 'mongoose', label: 'Mongoose' });
    options.push({ value: 'none', label: 'None' });
  } else if (database !== 'none') {
    options.push({ value: 'prisma', label: 'Prisma' });
    options.push({ value: 'drizzle', label: 'Drizzle' });
    options.push({ value: 'none', label: 'None' });
  } else {
    options.push({ value: 'none', label: 'None' });
  }
  return options;
}

describe('Project Name Validation', () => {
  it('accepts valid kebab-case project names', () => {
    expect(projectNameSchema.safeParse('my-project').success).toBe(true);
  });

  it('accepts valid snake_case project names', () => {
    expect(projectNameSchema.safeParse('my_project').success).toBe(true);
  });

  it('accepts valid dot notation names', () => {
    expect(projectNameSchema.safeParse('my.project').success).toBe(true);
  });

  it('accepts current directory (.)', () => {
    expect(projectNameSchema.safeParse('.').success).toBe(true);
  });

  it('accepts scoped package names', () => {
    expect(projectNameSchema.safeParse('@scope/package').success).toBe(true);
  });

  it('rejects empty string', () => {
    const result = projectNameSchema.safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Project name is required');
    }
  });

  it('rejects project names starting with uppercase', () => {
    expect(projectNameSchema.safeParse('MyProject').success).toBe(false);
  });

  it('rejects project names with spaces', () => {
    expect(projectNameSchema.safeParse('my project').success).toBe(false);
  });

  it('rejects project names with special characters', () => {
    expect(projectNameSchema.safeParse('my@project!').success).toBe(false);
  });
});

describe('ORM Options Logic', () => {
  it('returns prisma, drizzle, none for postgres', () => {
    const options = getOrmOptions('postgres');
    expect(options).toHaveLength(3);
    expect(options.map(o => o.value)).toEqual(['prisma', 'drizzle', 'none']);
  });

  it('returns prisma, drizzle, none for mysql', () => {
    const options = getOrmOptions('mysql');
    expect(options).toHaveLength(3);
    expect(options.map(o => o.value)).toEqual(['prisma', 'drizzle', 'none']);
  });

  it('returns prisma, drizzle, none for sqlite', () => {
    const options = getOrmOptions('sqlite');
    expect(options).toHaveLength(3);
    expect(options.map(o => o.value)).toEqual(['prisma', 'drizzle', 'none']);
  });

  it('returns mongoose, none for mongodb', () => {
    const options = getOrmOptions('mongodb');
    expect(options).toHaveLength(2);
    expect(options.map(o => o.value)).toEqual(['mongoose', 'none']);
  });

  it('returns only none for no database', () => {
    const options = getOrmOptions('none');
    expect(options).toHaveLength(1);
    expect(options[0].value).toBe('none');
  });
});
