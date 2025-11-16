# E-Learning API - Frontend Integration Guide

## User Flow (Mock Authentication)

### Scenario
A user logs in and belongs to:
- **User**: id=1, username="user@ramboll.com"
- **Unit**: id=1, name="Copenhagen Office"  
- **Universe**: id=1, name="Ramboll Denmark"

---

## API Endpoints

### 1. List View - Get My E-Learnings
**Use when:** User clicks "E-Learnings" in navigation

```http
GET /api/e-learnings?universeId=1
```

**Mock Usage:**
```typescript
// In your frontend, simulate logged-in user's universe
const universeId = 1; // Later: get from JWT/auth context

const response = await fetch(`/api/e-learnings?universeId=${universeId}`);
const eLearnings = await response.json();
```

**Response (Light Data):**
```json
[
  {
    "id": 1,
    "title": "Sustainability Training",
    "description": "Learn about environmental responsibility",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "universeElearnings": [
      {
        "id": 1,
        "assignedAt": "2024-01-15T10:00:00Z",
        "universe": { "id": 1, "name": "Ramboll Denmark" }
      },
      {
        "id": 2,
        "assignedAt": "2024-01-15T10:00:00Z",
        "universe": { "id": 2, "name": "Ramboll Sweden" }
      }
    ]
  },
  {
    "id": 2,
    "title": "Safety Procedures",
    "description": "Workplace safety guidelines",
    "createdAt": "2024-01-16T10:00:00Z",
    "updatedAt": "2024-01-16T10:00:00Z",
    "universeElearnings": [
      {
        "id": 3,
        "assignedAt": "2024-01-16T10:00:00Z",
        "universe": { "id": 1, "name": "Ramboll Denmark" }
      }
    ]
  }
]
```

**Frontend Display:**
- Show cards with: title, description
- Badge showing assigned universes (from `universeElearnings[].universe.name`)
- Show assignment date if needed (from `universeElearnings[].assignedAt`)
- "Start Course" button → navigate to detail view

---

### 2. Detail View - Get Full E-Learning
**Use when:** User clicks on a specific e-learning

```http
GET /api/e-learnings/1
```

**Response (Deep Population):**
```json
{
  "id": 1,
  "title": "Sustainability Training",
  "description": "Learn about environmental responsibility",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "steps": [
    {
      "id": 1,
      "title": "Introduction to Sustainability",
      "orderIndex": 1,
      "stepBlocks": [
        {
          "id": 1,
          "orderIndex": 1,
          "block": {
            "id": 1,
            "type": "video",
            "headline": "Welcome Video",
            "description": "Introduction to the course",
            "content": {
              "video_url": "https://example.com/intro.mp4"
            }
          }
        },
        {
          "id": 2,
          "orderIndex": 2,
          "block": {
            "id": 2,
            "type": "image",
            "headline": "Key Concepts",
            "description": "Visual overview",
            "content": {
              "image_urls": ["https://example.com/concept1.jpg"]
            }
          }
        }
      ]
    },
    {
      "id": 2,
      "title": "Assessment",
      "orderIndex": 2,
      "stepBlocks": [
        {
          "id": 3,
          "orderIndex": 1,
          "block": {
            "id": 3,
            "type": "flip_cards",
            "headline": "Test Your Knowledge",
            "description": "Flip cards to learn",
            "content": {
              "cards": [
                {
                  "front": "What is sustainability?",
                  "back": "Meeting present needs without compromising future generations"
                }
              ]
            }
          }
        }
      }
    }
  ],
  "universeElearnings": [
    {
      "id": 1,
      "assignedAt": "2024-01-15T10:00:00Z",
      "universe": {
        "id": 1,
        "name": "Ramboll Denmark"
      }
    }
  ]
}
```

**Frontend Rendering:**
1. Sort `steps` by `orderIndex`
2. For each step, sort `stepBlocks` by `orderIndex`
3. Render each `block` based on its `type`:
   - `video`: Show video player with `content.video_url`
   - `image`: Show image gallery with `content.image_urls`
   - `flip_cards`: Render interactive flip cards with `content.cards`
   - `interactive_tabs`: Render tabs with `content.tabs`
   - `feedback_activity`: Show form with `content.question`

---

## Testing in Postman

### Simulate Different Users

**User in Universe 1 (Ramboll Denmark):**
```http
GET /api/e-learnings?universeId=1
```

**User in Universe 2 (Ramboll Sweden):**
```http
GET /api/e-learnings?universeId=2
```

**User in Universe 3 (Ramboll Norway):**
```http
GET /api/e-learnings?universeId=3
```

Each will return only e-learnings assigned to that universe.

---

## Migration Path to JWT Auth

When implementing real authentication, replace the query parameter approach:

### Before (Mock):
```typescript
GET /api/e-learnings?universeId=1
```

### After (JWT):
```typescript
// Controller
@Get()
async findAll(@CurrentUser() user: CurrentUserData) {
  return this.eLearningsService.findAllByUniverseId(user.universeId);
}

// Frontend - no change needed, JWT automatically sent in headers
const response = await fetch('/api/e-learnings', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

The service layer stays exactly the same!

---

## Response Data Sizes

**List View (`/api/e-learnings?universeId=1`):**
- ~1-2 KB per e-learning
- Only metadata + universe names
- Fast loading for list display

**Detail View (`/api/e-learnings/1`):**
- ~10-50 KB depending on content
- Full course structure with all blocks
- Lazy loaded when user clicks

---

## Example Frontend Flow

```typescript
// 1. User lands on e-learnings list page
const mockUniverseId = 1; // TODO: Get from auth context
const eLearnings = await fetchMyELearnings(mockUniverseId);

// Display list of courses

// 2. User clicks "Start Course" on course ID 1
const fullCourse = await fetchELearningDetail(1);

// Render course player with steps and blocks
renderCoursePlayer(fullCourse);
```

---

## Database Seed Data

The seeder creates 3 e-learnings:
1. **Sustainability 1** - Assigned to Universe 1 & 2
2. **Sustainability 2** - Assigned to Universe 1 & 3  
3. **Sustainability 3** - Assigned to Universe 2 & 3

Test with different `universeId` values to see filtering in action!
