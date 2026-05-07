const http = require('http');

async function request(path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path,
      method,
      headers: {}
    };

    if (body) {
      options.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (e) => resolve({ status: 500, error: e.message }));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("TEST 1 - Health Check");
  let res = await request('/');
  console.log(`Actual: ${res.status}\n`);

  console.log("TEST 2 - Get all salaries");
  res = await request('/salaries');
  console.log(`Actual status: ${res.status}\nActual count: ${res.data?.count}\n`);

  console.log("TEST 3 - Filter by company");
  res = await request('/salaries?company=google');
  console.log(`Actual status: ${res.status}\nActual count: ${res.data?.count}\n`);

  console.log("TEST 4 - Filter by level");
  res = await request('/salaries?level=L5');
  console.log(`Actual status: ${res.status}\nActual count: ${res.data?.count}\n`);

  console.log("TEST 5 - Combined filter");
  res = await request('/salaries?company=google&level=L5');
  console.log(`Actual status: ${res.status}\nActual count: ${res.data?.count}\n`);

  console.log("TEST 6 - Invalid level filter");
  res = await request('/salaries?level=INVALID_LEVEL');
  console.log(`Actual: ${res.status}\n`);

  console.log("TEST 7 - Company not found");
  res = await request('/company/thiscompanydoesnotexist999');
  console.log(`Actual: ${res.status}\n`);

  console.log("TEST 8 - Valid company page");
  res = await request('/company/google');
  console.log(`Actual status: ${res.status}\nActual median_total_compensation value: ${res.data.median_total_compensation}\nActual level_distribution object: ${JSON.stringify(res.data.level_distribution)}\n`);

  console.log("TEST 9 - Company name case insensitivity");
  res = await request('/company/Google');
  console.log(`Actual: ${res.status}\n`);

  console.log("TEST 10 - Ingest valid salary");
  const validBody = {
    company: "TestCo",
    role: "Software Engineer",
    level: "L5",
    location: "Bangalore",
    experience_years: 6,
    base_salary: 4500000,
    bonus: 400000,
    stock: 800000,
    confidence: 0.85
  };
  res = await request('/ingest-salary', 'POST', validBody);
  console.log(`Actual status: ${res.status}\nActual total_compensation: ${res.data.total_compensation}\n`);

  console.log("TEST 11 - Ingest duplicate");
  res = await request('/ingest-salary', 'POST', validBody);
  console.log(`Actual: ${res.status} ${JSON.stringify(res.data)}\n`);

  console.log("TEST 12 - Ingest missing required field");
  res = await request('/ingest-salary', 'POST', {
    company: "TestCo",
    role: "Software Engineer",
    location: "Bangalore",
    experience_years: 6,
    base_salary: 4500000
  });
  console.log(`Actual: ${res.status}\n`);

  console.log("TEST 13 - Ingest invalid level");
  res = await request('/ingest-salary', 'POST', {
    company: "TestCo",
    role: "Engineer",
    level: "Senior Engineer",
    location: "Bangalore",
    experience_years: 5,
    base_salary: 3000000
  });
  console.log(`Actual: ${res.status}\n`);

  console.log("TEST 14 - Ingest negative base salary");
  res = await request('/ingest-salary', 'POST', {
    company: "TestCo",
    role: "Engineer",
    level: "L4",
    location: "Mumbai",
    experience_years: 4,
    base_salary: -100000
  });
  console.log(`Actual: ${res.status}\n`);

  console.log("TEST 15 - Ingest with company name variations");
  res = await request('/ingest-salary', 'POST', {
    company: "  AMAZON  ",
    role: "SDE",
    level: "SDE2",
    location: "Hyderabad",
    experience_years: 3,
    base_salary: 2800000,
    confidence: 0.7
  });
  console.log(`Actual stored company value: ${res.data.company}\n`);

  console.log("TEST 16 - Compare");
  const g = await request('/salaries?company=google');
  if (g.data.data && g.data.data.length >= 2) {
    const idA = g.data.data[0].id;
    const idB = g.data.data[1].id;
    res = await request(`/compare?salaryId1=${idA}&salaryId2=${idB}`);
    console.log(`Actual status: ${res.status}`);
    console.log(`Math check: ${res.data.salary1.total_compensation} - ${res.data.salary2.total_compensation} = ${res.data.salary1.total_compensation - res.data.salary2.total_compensation} | API returned: ${res.data.difference.total_compensation}`);
    console.log(`PASS or FAIL: ${res.data.salary1.total_compensation - res.data.salary2.total_compensation === res.data.difference.total_compensation ? 'PASS' : 'FAIL'}\n`);
    
    console.log("TEST 17 - Compare same ID twice");
    res = await request(`/compare?salaryId1=${idA}&salaryId2=${idA}`);
    console.log(`Actual: ${res.status}\n`);
  } else {
    console.log("Could not find 2 Google IDs for Test 16");
  }

  console.log("TEST 18 - Compare missing param");
  res = await request('/compare?salaryId1=FAKE');
  console.log(`Actual: ${res.status}\n`);

  console.log("TEST 19 - Sorting");
  res = await request('/salaries?sortBy=total_compensation&order=asc');
  if (res.data.data && res.data.data.length > 0) {
    const first = res.data.data[0].total_compensation;
    const last = res.data.data[res.data.data.length - 1].total_compensation;
    console.log(`First record TC: ${first}`);
    console.log(`Last record TC: ${last}`);
    console.log(`Is first < last? ${first < last} PASS or FAIL: ${first < last ? 'PASS' : 'FAIL'}\n`);
  }
}

runTests();
