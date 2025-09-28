export const MOCK_USERS = {
  admin: {
    email: 'admin@talent.com',
    password: 'Password123!',
    firstName: 'Admin',
    lastName: 'User',
    roleIds: [1], // admin role
  },
  recruiter: {
    email: 'recruiter@company.com',
    password: 'Password123!',
    firstName: 'Recruiter',
    lastName: 'User',
    roleIds: [2], // recruitment_user role
    companyId: 1,
    departmentId: 1,
  },
  candidate: {
    email: 'candidate@email.com',
    password: 'Password123!',
    firstName: 'Candidate',
    lastName: 'User',
    roleIds: [3], // candidate_user role
  },
};

export const MOCK_COMPANIES = [
  {
    name: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    employeeCount: 500,
    commercialId: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    categoryId: 1,
  },
];

export const MOCK_OPPORTUNITIES = [
  {
    title: 'Senior Full Stack Developer',
    description: 'We are looking for an experienced full-stack developer.',
    jobType: 'full-time',
    salaryRange: '$80,000 - $120,000',
    departmentId: 1,
    publishScope: 'external',
    requirements: ['5+ years experience with React', 'TypeScript knowledge'],
    benefits: ['Health insurance', '401k matching'],
  },
];
