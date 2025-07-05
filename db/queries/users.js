import db from "#db/client";

export async function createUser(username, hashedPassword) {
  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username;
    `;
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function getUserByUsername(username) {
  const sql = `
    SELECT *
    FROM users
    WHERE username = $1
    `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);

  return user;
}

export async function getUserById(id) {
  const sql = `
    SELECT *
    FROM users
    WHERE id = $1
    `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
