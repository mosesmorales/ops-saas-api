import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

dotenv.config()

const host = process.env.MYSQL_HOST || 'localhost'
const port = Number(process.env.MYSQL_PORT || 3306)
const user = process.env.MYSQL_USER || 'root'
const password = process.env.MYSQL_PASSWORD || 'root'
const database = process.env.MYSQL_DATABASE || 'ops_saas'

async function main() {
  const admin = await mysql.createConnection({ host, port, user, password })
  await admin.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``)
  await admin.end()

  const db = await mysql.createConnection({ host, port, user, password, database })

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(160) NOT NULL UNIQUE,
      role VARCHAR(40) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(180) NOT NULL,
      owner VARCHAR(160) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INT AUTO_INCREMENT PRIMARY KEY,
      client_id INT NOT NULL,
      amount DECIMAL(12, 2) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      issued_at DATE DEFAULT (CURRENT_DATE),
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      owner VARCHAR(120) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS kpis (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(80) NOT NULL UNIQUE,
      value DECIMAL(12, 2) NOT NULL
    )
  `)

  await db.query(`INSERT IGNORE INTO users (id, name, email, role, status) VALUES
    (1, 'Admin', 'admin@ops.local', 'admin', 'active'),
    (2, 'Ana Ruiz', 'ana@demo.com', 'admin', 'active'),
    (3, 'Luis Perez', 'luis@demo.com', 'sales', 'active')
  `)

  await db.query(`INSERT IGNORE INTO clients (id, name, owner, status) VALUES
    (1, 'Cafe del Sol', 'Maria Gomez', 'active'),
    (2, 'Distribuidora Norte', 'Jorge Lara', 'review'),
    (3, 'Textiles Luna', 'Karina Diaz', 'active')
  `)

  await db.query(`INSERT IGNORE INTO invoices (id, client_id, amount, status, issued_at) VALUES
    (1, 1, 18200, 'paid', CURRENT_DATE),
    (2, 2, 24900, 'overdue', CURRENT_DATE),
    (3, 3, 9500, 'pending', CURRENT_DATE)
  `)

  await db.query(`INSERT IGNORE INTO tasks (id, title, owner, status) VALUES
    (1, 'Actualizar contrato de servicio', 'Operaciones', 'in_progress'),
    (2, 'Llamada de seguimiento', 'Ventas', 'today'),
    (3, 'Revision de KPIs', 'Direccion', 'week')
  `)

  await db.query(`INSERT IGNORE INTO kpis (id, label, value) VALUES
    (1, 'retention_rate', 0.92),
    (2, 'avg_ticket', 4150),
    (3, 'response_time_hours', 2.4),
    (4, 'satisfaction_score', 4.6)
  `)

  await db.end()
  console.log('Migration complete')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
