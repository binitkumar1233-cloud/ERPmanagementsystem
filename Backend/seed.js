require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Course = require('./models/Course');
const { FeeStructure } = require('./models/Fee');

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
        User.deleteMany(),
        Student.deleteMany(),
        Teacher.deleteMany(),
        Course.deleteMany(),
        FeeStructure.deleteMany(),
    ]);
    console.log('Cleared existing data');

    // Admin users
    await User.create([
        { name: 'Admin User',   email: 'admin@edumanage.in',  password: 'Admin@123', role: 'Super Admin', dept: 'Management', status: 'Active' },
        { name: 'Priya Sharma', email: 'priya@edumanage.in',  password: 'Admin@123', role: 'Admin',       dept: 'Academics',  status: 'Active' },
        { name: 'Ravi Kumar',   email: 'ravi@edumanage.in',   password: 'Admin@123', role: 'Editor',      dept: 'Finance',    status: 'Active' },
    ]);
    console.log('✔ Admin users created');

    // Teachers — insert sequentially to avoid auto-ID race condition
    const teacherData = [
        { name: 'Dr. Kavitha Rao',   email: 'kavitha.r@edu.in', phone: '9876500001', dept: 'Electronics', designation: 'Professor',    status: 'Active' },
        { name: 'Prof. Suresh Babu', email: 'suresh.b@edu.in',  phone: '9876500002', dept: 'Mathematics', designation: 'Assoc. Prof.', status: 'Active' },
        { name: 'Ms. Deepa Menon',   email: 'deepa.m@edu.in',   phone: '9876500003', dept: 'Physics',     designation: 'Asst. Prof.',  status: 'Active' },
        { name: 'Dr. Aryan Shah',    email: 'aryan.s@edu.in',   phone: '9876500004', dept: 'CS',          designation: 'HOD',          status: 'Active' },
        { name: 'Mrs. Lakshmi Das',  email: 'lakshmi.d@edu.in', phone: '9876500005', dept: 'Commerce',    designation: 'Lecturer',     status: 'Inactive' },
    ];
    for (const t of teacherData) await Teacher.create(t);
    console.log('✔ Teachers created');

    // Courses — insert sequentially
    const courseData = [
        { name: 'B.Tech Computer Science', code: 'BTCS', dept: 'CS',          seats: 60, enrolled: 54, duration: '4 years', fees: 120000, status: 'Active'   },
        { name: 'MBA',                      code: 'MBA',  dept: 'Management',  seats: 40, enrolled: 38, duration: '2 years', fees: 95000,  status: 'Active'   },
        { name: 'B.Sc Physics',             code: 'BPHY', dept: 'Physics',     seats: 30, enrolled: 22, duration: '3 years', fees: 45000,  status: 'Active'   },
        { name: 'B.Com',                    code: 'BCOM', dept: 'Commerce',    seats: 50, enrolled: 48, duration: '3 years', fees: 40000,  status: 'Active'   },
        { name: 'M.Sc Mathematics',         code: 'MSMA', dept: 'Mathematics', seats: 20, enrolled: 15, duration: '2 years', fees: 55000,  status: 'Inactive' },
    ];
    for (const c of courseData) await Course.create(c);
    console.log('✔ Courses created');

    // Students — insert sequentially
    const studentData = [
        { name: 'Ananya Reddy',  email: 'ananya@student.in',  phone: '9876543201', course: 'B.Tech CS',    year: '3rd', fees: 'Paid',    status: 'Active'   },
        { name: 'Vikram Singh',  email: 'vikram@student.in',  phone: '9876543202', course: 'MBA',          year: '1st', fees: 'Pending', status: 'Active'   },
        { name: 'Meena Iyer',    email: 'meena@student.in',   phone: '9876543203', course: 'B.Sc Physics', year: '2nd', fees: 'Paid',    status: 'Active'   },
        { name: 'Rohit Gupta',   email: 'rohit@student.in',   phone: '9876543204', course: 'B.Com',        year: '3rd', fees: 'Overdue', status: 'Active'   },
        { name: 'Kavitha Nair',  email: 'kavitha@student.in', phone: '9876543205', course: 'B.Tech CS',    year: '1st', fees: 'Paid',    status: 'Active'   },
        { name: 'Arun Joshi',    email: 'arun@student.in',    phone: '9876543206', course: 'M.Sc Maths',   year: '2nd', fees: 'Partial', status: 'Inactive' },
    ];
    for (const s of studentData) await Student.create(s);
    console.log('✔ Students created');

    // Fee structures
    await FeeStructure.create([
        { course: 'B.Tech CS',        tuition: 100000, lab: 15000, library: 3000, sports: 2000, year: '2026-27', status: 'Active' },
        { course: 'MBA',              tuition: 80000,  lab: 5000,  library: 4000, sports: 3000, year: '2026-27', status: 'Active' },
        { course: 'B.Sc Physics',     tuition: 35000,  lab: 7000,  library: 2000, sports: 1000, year: '2026-27', status: 'Active' },
        { course: 'B.Com',            tuition: 32000,  lab: 3000,  library: 3000, sports: 2000, year: '2026-27', status: 'Active' },
        { course: 'M.Sc Mathematics', tuition: 48000,  lab: 4000,  library: 2000, sports: 1000, year: '2026-27', status: 'Active' },
    ]);
    console.log('✔ Fee structures created');

    console.log('\n✅ Database seeded successfully!');
    console.log('─────────────────────────────────');
    console.log('Admin login credentials:');
    console.log('  Email:    admin@edumanage.in');
    console.log('  Password: Admin@123');
    console.log('─────────────────────────────────\n');
    process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
