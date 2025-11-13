# Patient Photo Management System - Implementation Plan

**Date:** November 13, 2025
**Target:** Convert Next.js App to Simplified Patient Photo Management System
**Approach:** Local Storage, No Auth, No Database, Core Functionality Only

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Simplified Requirements](#simplified-requirements)
3. [Architecture Overview](#architecture-overview)
4. [Feature Breakdown](#feature-breakdown)
5. [Implementation Phases](#implementation-phases)
6. [Technical Stack](#technical-stack)
7. [File Structure](#file-structure)
8. [Data Models](#data-models)
9. [Component Design](#component-design)
10. [Implementation Steps](#implementation-steps)

---

## 1. Project Overview

### Objective
Build a simplified web-based patient photo management system that allows users to:
- Upload photos/documents for patients
- Organize files by patient ID and date
- View and download patient media
- Manage files using browser local storage

### Key Simplifications
- ❌ **No Authentication** - Direct access to the application
- ❌ **No Database** - All data stored in browser's localStorage
- ❌ **No Cloud Storage** - Files stored as base64 in localStorage
- ❌ **No 7-day Cleanup** - Manual cleanup via UI
- ❌ **No Mobile App** - Web-only implementation
- ✅ **Core Functionality** - Upload, organize, view, download

---

## 2. Simplified Requirements

### Must Have Features
1. **Patient Management**
   - Input patient ID (alphanumeric)
   - Validate patient ID before upload
   - View list of all patients

2. **File Upload**
   - Upload multiple files (photos/documents)
   - Support formats: JPG, JPEG, PNG, PDF
   - File size limit: 5MB per file (localStorage constraint)
   - Auto-naming: `[PATIENT_ID]_[DATE]_[SEQUENCE].[ext]`
   - Progress indication during upload

3. **File Organization**
   - Organize by Patient ID → Date → Files
   - Folder structure: `/PatientMedia/[PATIENT_ID]/[YYYY-MM-DD]/`
   - Display files grouped by date

4. **File Viewing**
   - Thumbnail view for images
   - File preview (images only)
   - List view with file details
   - Filter by patient and date

5. **Download Functionality**
   - Download individual files
   - Download all files for a date (ZIP)
   - Download all files for a patient (ZIP)

6. **Storage Management**
   - Display storage usage
   - Warning when approaching localStorage limit (~5-10MB)
   - Manual cleanup/delete options
   - Export all data option

### Nice to Have Features (Future)
- Search functionality across patients
- File annotations/notes
- Drag & drop upload
- Print functionality
- Dark mode

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Next.js App                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   Upload     │  │   Patient    │  │  Storage  │ │
│  │   Page       │  │   Dashboard  │  │  Manager  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │         Local Storage Service Layer          │  │
│  │  - File Storage (base64)                     │  │
│  │  - Metadata Management                       │  │
│  │  - CRUD Operations                           │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │         Browser localStorage API             │  │
│  │  Key: patientMedia → JSON Data               │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 4. Feature Breakdown

### 4.1 Upload Workflow
```
User Input Patient ID
    → Validate Patient ID
    → Select Files (Camera/File System)
    → Validate File Types & Sizes
    → Generate Auto File Names
    → Convert to Base64
    → Store in localStorage with Metadata
    → Show Success/Error Messages
```

### 4.2 View Workflow
```
User Selects Patient
    → Fetch Patient Data from localStorage
    → Display Dates with File Counts
    → User Selects Date
    → Display Thumbnails/List of Files
    → User Clicks File
    → Show Full Preview/Download Option
```

### 4.3 Download Workflow
```
User Selects Download Option
    → Single File: Direct download
    → Multiple Files: Create ZIP
    → Trigger Browser Download
```

---

## 5. Implementation Phases

### Phase 1: Setup & Foundation (Day 1)
- [ ] Set up project structure
- [ ] Create basic layout with navigation
- [ ] Implement localStorage service layer
- [ ] Create TypeScript types/interfaces
- [ ] Set up routing structure

### Phase 2: Upload Functionality (Day 2-3)
- [ ] Build upload page UI
- [ ] Implement patient ID input & validation
- [ ] Create file upload component
- [ ] File type and size validation
- [ ] Auto-naming logic
- [ ] Base64 conversion & storage
- [ ] Progress indicators
- [ ] Success/error notifications

### Phase 3: Dashboard & Viewing (Day 4-5)
- [ ] Build patient dashboard
- [ ] Patient list component
- [ ] Date-based file grouping
- [ ] Thumbnail grid component
- [ ] File preview modal
- [ ] File details display

### Phase 4: Download & Export (Day 6)
- [ ] Single file download
- [ ] ZIP creation for multiple files
- [ ] Batch download functionality
- [ ] Export all data feature

### Phase 5: Storage Management (Day 7)
- [ ] Storage usage display
- [ ] Storage limit warnings
- [ ] Delete functionality
- [ ] Clear all data option
- [ ] Data import/export

### Phase 6: Polish & Testing (Day 8)
- [ ] Error handling
- [ ] Loading states
- [ ] Responsive design
- [ ] Browser compatibility testing
- [ ] Performance optimization

---

## 6. Technical Stack

### Core Technologies
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Storage:** Browser localStorage API

### Additional Libraries
```json
{
  "jszip": "^3.10.1",           // For creating ZIP files
  "file-saver": "^2.0.5",       // For downloading files
  "react-dropzone": "^14.2.3",  // For drag & drop upload
  "date-fns": "^3.0.0",         // For date formatting
  "lucide-react": "^0.300.0",   // For icons
  "sonner": "^1.3.0"            // For toast notifications
}
```

---

## 7. File Structure

```
ipms/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home/Dashboard page
│   ├── globals.css                # Global styles
│   ├── upload/
│   │   └── page.tsx              # Upload page
│   ├── patient/
│   │   └── [id]/
│   │       └── page.tsx          # Patient detail page
│   └── storage/
│       └── page.tsx              # Storage management page
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── progress.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── navigation.tsx
│   │   └── footer.tsx
│   ├── upload/
│   │   ├── patient-id-input.tsx
│   │   ├── file-uploader.tsx
│   │   ├── file-preview.tsx
│   │   └── upload-progress.tsx
│   ├── patient/
│   │   ├── patient-list.tsx
│   │   ├── patient-card.tsx
│   │   └── date-selector.tsx
│   ├── media/
│   │   ├── media-grid.tsx
│   │   ├── media-thumbnail.tsx
│   │   ├── media-viewer.tsx
│   │   └── download-button.tsx
│   └── storage/
│       ├── storage-meter.tsx
│       ├── storage-stats.tsx
│       └── cleanup-tools.tsx
├── lib/
│   ├── storage/
│   │   ├── local-storage.ts     # localStorage wrapper
│   │   ├── file-storage.ts      # File CRUD operations
│   │   └── storage-utils.ts     # Helper functions
│   ├── utils/
│   │   ├── file-utils.ts        # File validation, naming
│   │   ├── date-utils.ts        # Date formatting
│   │   ├── download-utils.ts    # Download & ZIP creation
│   │   └── validation.ts        # Input validation
│   └── types/
│       ├── patient.ts           # Patient types
│       ├── file.ts              # File types
│       └── storage.ts           # Storage types
├── hooks/
│   ├── use-local-storage.ts     # localStorage hook
│   ├── use-file-upload.ts       # Upload logic hook
│   └── use-storage-info.ts      # Storage info hook
└── public/
    └── icons/                    # Static icons/images
```

---

## 8. Data Models

### 8.1 localStorage Structure
```typescript
// Key: "patientMedia"
{
  patients: {
    [patientId: string]: {
      id: string;
      createdAt: string;
      updatedAt: string;
      totalFiles: number;
      totalSize: number;
      dates: {
        [dateString: string]: {
          date: string; // YYYY-MM-DD
          files: FileMetadata[];
        }
      }
    }
  },
  metadata: {
    totalPatients: number;
    totalFiles: number;
    totalSize: number;
    lastUpdated: string;
  }
}
```

### 8.2 TypeScript Interfaces

```typescript
// lib/types/patient.ts
export interface Patient {
  id: string;
  createdAt: string;
  updatedAt: string;
  totalFiles: number;
  totalSize: number;
  dates: Record<string, DateGroup>;
}

export interface DateGroup {
  date: string; // YYYY-MM-DD
  files: FileMetadata[];
}

// lib/types/file.ts
export interface FileMetadata {
  id: string;
  patientId: string;
  originalName: string;
  storedName: string; // [PATIENT_ID]_[DATE]_[SEQUENCE].[ext]
  fileType: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  date: string; // YYYY-MM-DD
  sequence: number;
  base64Data: string;
}

export interface UploadFile {
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

// lib/types/storage.ts
export interface StorageInfo {
  used: number; // bytes
  available: number; // bytes
  limit: number; // bytes
  usagePercentage: number;
}

export interface StorageMetadata {
  totalPatients: number;
  totalFiles: number;
  totalSize: number;
  lastUpdated: string;
}
```

---

## 9. Component Design

### 9.1 Page Components

#### Home/Dashboard (`app/page.tsx`)
- Patient statistics cards
- Recent uploads list
- Quick actions (Upload, View Patients, Manage Storage)
- Storage usage indicator

#### Upload Page (`app/upload/page.tsx`)
- Patient ID input with validation
- File upload zone (drag & drop + click)
- File preview list
- Upload progress indicators
- Success/error messages

#### Patient Detail Page (`app/patient/[id]/page.tsx`)
- Patient ID header
- Date selector/list
- File grid/list view
- Download options
- Delete options

#### Storage Management (`app/storage/page.tsx`)
- Storage usage visualization
- Patient storage breakdown
- Cleanup tools
- Export/import data
- Clear all data option

### 9.2 Key Component Features

#### FileUploader Component
```typescript
interface FileUploaderProps {
  patientId: string;
  onUploadComplete: (files: FileMetadata[]) => void;
  onError: (error: string) => void;
}
```
- Drag & drop zone
- Click to browse
- Multiple file selection
- File type validation
- Size validation (5MB limit)
- Preview before upload
- Progress tracking

#### MediaGrid Component
```typescript
interface MediaGridProps {
  files: FileMetadata[];
  onFileClick: (file: FileMetadata) => void;
  onDownload: (fileId: string) => void;
  onDelete: (fileId: string) => void;
}
```
- Thumbnail view for images
- File icon for PDFs
- File name & size display
- Download & delete buttons
- Loading states

#### StorageMeter Component
```typescript
interface StorageMeterProps {
  used: number;
  limit: number;
}
```
- Visual progress bar
- Percentage display
- Warning when > 80%
- Critical when > 95%

---

## 10. Implementation Steps

### Step 1: Project Setup
```bash
# Install dependencies
npm install jszip file-saver date-fns lucide-react sonner

# Create folder structure
mkdir -p components/{ui,layout,upload,patient,media,storage}
mkdir -p lib/{storage,utils,types}
mkdir -p hooks
mkdir -p app/{upload,patient,storage}
```

### Step 2: Create Type Definitions
Create all TypeScript interfaces in `lib/types/`

### Step 3: Build Storage Layer
```typescript
// lib/storage/local-storage.ts
- getItem()
- setItem()
- removeItem()
- clear()
- getStorageInfo()

// lib/storage/file-storage.ts
- createPatient()
- getPatient()
- getAllPatients()
- addFiles()
- getFiles()
- deleteFile()
- deletePatient()
```

### Step 4: Build Utility Functions
```typescript
// lib/utils/file-utils.ts
- validateFileType()
- validateFileSize()
- generateFileName()
- convertToBase64()
- base64ToBlob()

// lib/utils/download-utils.ts
- downloadFile()
- createZip()
- downloadZip()
```

### Step 5: Create UI Components
Build reusable components in `components/ui/`:
- Button
- Card
- Input
- Modal
- Progress

### Step 6: Build Upload Flow
1. Create patient ID input component
2. Create file uploader component
3. Implement upload logic
4. Add progress tracking
5. Add success/error notifications

### Step 7: Build Dashboard
1. Create patient list component
2. Display patient cards with stats
3. Add navigation to patient details
4. Show storage usage

### Step 8: Build Patient Detail View
1. Create date selector
2. Build media grid
3. Implement file preview
4. Add download functionality

### Step 9: Build Storage Management
1. Create storage meter
2. Add storage statistics
3. Implement delete functionality
4. Add export/import features

### Step 10: Testing & Polish
1. Test all CRUD operations
2. Test edge cases (storage full, invalid files)
3. Add error boundaries
4. Improve loading states
5. Ensure responsive design
6. Cross-browser testing

---

## Key Constraints & Considerations

### localStorage Limitations
- **Size Limit:** ~5-10MB depending on browser
- **Data Format:** Strings only (use JSON.stringify/parse)
- **Performance:** Synchronous operations (can block UI)
- **Security:** Not encrypted, accessible via DevTools
- **Persistence:** Can be cleared by user/browser

### Mitigation Strategies
1. **File Size Limit:** Restrict uploads to 5MB per file
2. **Total Storage Warning:** Show warnings at 80% capacity
3. **Compression:** Consider image compression before storage
4. **Chunking:** Process large operations in chunks
5. **Error Handling:** Graceful degradation when storage full

### File Format Handling
- **Images (JPG, PNG):** Convert to base64, show thumbnails
- **PDFs:** Store as base64, show file icon (no preview)
- **Size Optimization:** Compress images to reduce storage

---

## Success Criteria

### Functional Requirements
- ✅ Users can upload files for patients
- ✅ Files are organized by patient ID and date
- ✅ Users can view all patients and their files
- ✅ Users can download individual or multiple files
- ✅ Storage usage is displayed and manageable

### Technical Requirements
- ✅ All data persists in localStorage
- ✅ No external dependencies (APIs, databases)
- ✅ Works offline
- ✅ Responsive design (desktop & tablet)
- ✅ TypeScript type safety
- ✅ Error handling for edge cases

### User Experience
- ✅ Intuitive navigation
- ✅ Clear feedback for all actions
- ✅ Fast loading times
- ✅ Professional UI design
- ✅ Accessible on modern browsers

---

## Timeline Estimate

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1: Setup | 4 hours | Project structure, types, storage layer |
| Phase 2: Upload | 8 hours | Upload UI, validation, storage integration |
| Phase 3: Dashboard | 8 hours | Patient list, viewing, navigation |
| Phase 4: Download | 4 hours | Download logic, ZIP creation |
| Phase 5: Storage Mgmt | 4 hours | Storage UI, cleanup tools |
| Phase 6: Polish | 4 hours | Testing, responsive design, error handling |
| **Total** | **32 hours** | **~4-5 working days** |

---

## Future Enhancements

### Phase 2 Features (Optional)
1. **IndexedDB Migration:** Move from localStorage to IndexedDB for larger storage
2. **Search Functionality:** Search patients by ID or date
3. **Annotations:** Add notes/comments to files
4. **File Metadata:** Capture device info, location (if permitted)
5. **Print Functionality:** Print patient records
6. **Export Reports:** Generate PDF reports
7. **Bulk Operations:** Bulk delete, bulk download
8. **Dark Mode:** Theme support

### Mobile Support
- Progressive Web App (PWA)
- Camera integration for mobile upload
- Touch-optimized UI

---

## Conclusion

This plan provides a complete roadmap to convert the current Next.js app into a simplified Patient Photo Management System. By focusing on core functionality and using localStorage, we eliminate complexity while delivering a fully functional solution.

The implementation prioritizes:
- ✅ **Simplicity:** No auth, no database, no external services
- ✅ **Functionality:** All essential features covered
- ✅ **Usability:** Clean, intuitive interface
- ✅ **Reliability:** Robust error handling and validation
- ✅ **Maintainability:** Well-organized code structure

**Ready to start implementation!**
