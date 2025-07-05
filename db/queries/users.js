import db from "#db/client";

export async function createUser(username, password) {
  // 'password' is the already-hashed password here
  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username;
    `;
  const {
    rows: [user],
  } = await db.query(sql, [username, password]); // Correctly uses the 'password' parameter
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

  return user; // Returns user object, including the 'password' column (the hash)
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
