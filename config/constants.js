const SUBJECTS = [
  'Math', 'Programming',
  'English', 'Portuguese',
  'Chemistry', 'Physic',
  'Statistics']

const MODELS = {
  'Student': 'Student',
  'Subject': 'Subject',
  'Teacher': 'Teacher',
}
const TABLES = {
  'Student': 'School-Students',
  'Subject': 'School-Subjects',
  'Teacher': 'School-Teachers'
}

const PORTS = {
  'http': 8040,
  'https': 8045
}
const HOST = '0.0.0.0'

module.exports = {
  SUBJECTS, MODELS,
  TABLES, PORTS, HOST
}