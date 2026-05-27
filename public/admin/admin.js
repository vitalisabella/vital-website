let adminToken = null;

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.success) {
      adminToken = data.token;
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('dashboardSection').style.display = 'block';
      document.querySelector('.admin-menu').innerHTML = `
        <li><a href="#" data-section="announcements" class="menu-item active">Announcements</a></li>
        <li><a href="#" data-section="team" class="menu-item">Team</a></li>
        <li><a href="#" data-section="about" class="menu-item">About</a></li>
        <li><a href="#" data-section="resources" class="menu-item">Resources</a></li>
        <li><a href="#" data-section="applications" class="menu-item">Applications</a></li>
        <li><a href="#" data-section="surveys" class="menu-item">Surveys</a></li>
      `;
      loadAnnouncements();
      loadTeam();
      loadAbout();
      loadResources();
      loadApplications();
      loadSurveys();
    } else {
      alert('Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
});

// Logout
document.addEventListener('click', (e) => {
  if (e.target.id === 'logoutBtn') {
    adminToken = null;
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('loginForm').reset();
  }
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab + 'Tab';
    document.getElementById(tab).classList.add('active');
  });
});

// Announcements
document.getElementById('announcementForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('announcementTitle').value;
  const content = document.getElementById('announcementContent').value;
  const imageFile = document.getElementById('announcementImage').files[0];
  
  let imageName = '';
  if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    const uploadRes = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: formData
    });
    const uploadData = await uploadRes.json();
    imageName = uploadData.filename;
  }

  try {
    const response = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ title, content, image: imageName })
    });

    if (response.ok) {
      document.getElementById('announcementForm').reset();
      loadAnnouncements();
    }
  } catch (error) {
    console.error('Error adding announcement:', error);
  }
});

async function loadAnnouncements() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    const list = document.getElementById('announcementsList');
    
    list.innerHTML = '<h4>Current Announcements</h4>' + data.announcements.map(a => `
      <div class="item-card">
        <div class="item-content">
          <h4>${a.title}</h4>
          <p>${a.content}</p>
        </div>
        <button onclick="deleteAnnouncement(${a.id})" class="btn btn-danger">Delete</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading announcements:', error);
  }
}

async function deleteAnnouncement(id) {
  if (confirm('Delete this announcement?')) {
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (response.ok) {
        loadAnnouncements();
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  }
}

// Team Members
document.getElementById('teamForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('teamName').value;
  const role = document.getElementById('teamRole').value;
  const bio = document.getElementById('teamBio').value;
  const photoFile = document.getElementById('teamPhoto').files[0];
  
  let photoName = '';
  if (photoFile) {
    const formData = new FormData();
    formData.append('image', photoFile);
    const uploadRes = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: formData
    });
    const uploadData = await uploadRes.json();
    photoName = uploadData.filename;
  }

  try {
    const response = await fetch('/api/admin/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ name, role, bio, photo: photoName })
    });

    if (response.ok) {
      document.getElementById('teamForm').reset();
      loadTeam();
    }
  } catch (error) {
    console.error('Error adding team member:', error);
  }
});

async function loadTeam() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    const list = document.getElementById('teamList');
    
    list.innerHTML = '<h4>Current Team</h4>' + data.team.map(t => `
      <div class="item-card">
        <div class="item-content">
          <h4>${t.name}</h4>
          <p><strong>${t.role}</strong></p>
          <p>${t.bio || ''}</p>
        </div>
        <button onclick="deleteTeamMember(${t.id})" class="btn btn-danger">Delete</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading team:', error);
  }
}

async function deleteTeamMember(id) {
  if (confirm('Delete this team member?')) {
    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (response.ok) {
        loadTeam();
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  }
}

// About
document.getElementById('aboutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('aboutTitle').value;
  const content = document.getElementById('aboutContent').value;
  const imageFile = document.getElementById('aboutImage').files[0];
  
  let imageName = '';
  if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    const uploadRes = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: formData
    });
    const uploadData = await uploadRes.json();
    imageName = uploadData.filename;
  }

  try {
    const response = await fetch('/api/admin/about', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ title, content, image: imageName })
    });

    if (response.ok) {
      alert('About section updated!');
    }
  } catch (error) {
    console.error('Error updating about:', error);
  }
});

async function loadAbout() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    document.getElementById('aboutTitle').value = data.about.title || 'Who Are We?';
    document.getElementById('aboutContent').value = data.about.content || '';
  } catch (error) {
    console.error('Error loading about:', error);
  }
}

// Resources
document.getElementById('resourceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('resourceTitle').value;
  const category = document.getElementById('resourceCategory').value;
  const link = document.getElementById('resourceLink').value;

  try {
    const response = await fetch('/api/admin/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ title, category, link })
    });

    if (response.ok) {
      document.getElementById('resourceForm').reset();
      loadResources();
    }
  } catch (error) {
    console.error('Error adding resource:', error);
  }
});

async function loadResources() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    const list = document.getElementById('resourcesList');
    
    list.innerHTML = '<h4>Current Resources</h4>' + data.resources.map(r => `
      <div class="item-card">
        <div class="item-content">
          <h4>${r.title}</h4>
          <p><strong>${r.category}</strong></p>
          <a href="${r.link}" target="_blank">View Resource</a>
        </div>
        <button onclick="deleteResource(${r.id})" class="btn btn-danger">Delete</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading resources:', error);
  }
}

async function deleteResource(id) {
  if (confirm('Delete this resource?')) {
    try {
      const response = await fetch(`/api/admin/resources/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (response.ok) {
        loadResources();
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  }
}

// Applications
async function loadApplications() {
  try {
    const response = await fetch('/api/admin/applications', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const applications = await response.json();
    const list = document.getElementById('applicationsList');
    
    if (applications.length === 0) {
      list.innerHTML = '<p>No applications yet</p>';
      return;
    }
    
    list.innerHTML = applications.map(app => `
      <div class="item-card">
        <div class="item-content">
          <h4>${app.fullName}</h4>
          <p><strong>Position:</strong> ${app.position}</p>
          <p><strong>Email:</strong> ${app.email}</p>
          <p><strong>Status:</strong> <span class="status ${app.status}">${app.status}</span></p>
          <p><strong>Motivation:</strong> ${app.motivation}</p>
        </div>
        <div class="action-buttons">
          <button onclick="updateApplicationStatus(${app.id}, 'approved')" class="btn btn-success">Approve</button>
          <button onclick="updateApplicationStatus(${app.id}, 'rejected')" class="btn btn-danger">Reject</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading applications:', error);
  }
}

async function updateApplicationStatus(id, status) {
  try {
    const response = await fetch(`/api/admin/applications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status })
    });
    if (response.ok) {
      loadApplications();
    }
  } catch (error) {
    console.error('Error updating application:', error);
  }
}

// Surveys
async function loadSurveys() {
  try {
    const response = await fetch('/api/admin/surveys', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const surveys = await response.json();
    const list = document.getElementById('surveysList');
    
    if (surveys.length === 0) {
      list.innerHTML = '<p>No survey responses yet</p>';
      return;
    }
    
    list.innerHTML = surveys.map(survey => `
      <div class="item-card">
        <div class="item-content">
          <h4>${survey.name}</h4>
          <p><strong>Mental Health Improvement:</strong> ${survey.mentalHealthImprovement}/5</p>
          <p><strong>Confidence Change:</strong> ${survey.confidenceChange}/5</p>
          <p><strong>Recommendation:</strong> ${survey.recommendation}/5</p>
          <p><strong>Feedback:</strong> ${survey.additionalFeedback || 'N/A'}</p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading surveys:', error);
  }
}
