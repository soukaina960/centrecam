import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, Link } from 'react-router-dom';
import './Selection.css';
//import logo from '../src/assests/images/Capture-removebg-preview-removebg-preview_1-removebg-preview copy.png';

// Constants
const LEVEL_CONFIG = [
  { id: 1, code: 'primaire', name: 'Primaire' },
  { id: 2, code: 'college', name: 'Collège' },
  { id: 3, code: 'lycee', name: 'Lycée' }
];

const CATEGORIES = [
  { value: 'S1', label: 'Semestre 1' },
  { value: 'S2', label: 'Semestre 2' },
  { value: 'concours', label: 'Concours' }
];

// Helper functions
const validateFile = (file) => {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 
    'image/png',
    'video/mp4',
    'video/x-matroska'
  ];

  if (!validTypes.includes(file.type)) {
    return { valid: false, message: 'Type de fichier non valide. Formats acceptés: PDF, DOC, DOCX, JPG, PNG, MP4, MKV' };
  }

  if (file.size > 50 * 1024 * 1024) {
    return { valid: false, message: 'La taille du fichier ne doit pas dépasser 50MB' };
  }

  return { valid: true };
};

const FilePreview = ({ fileUrl }) => {
  if (!fileUrl) return null;

  if (fileUrl.match(/\.(jpe?g|png|gif)$/i)) {
    return <img src={fileUrl} alt="Preview" className="img-thumbnail" style={{ maxWidth: '200px', maxHeight: '200px' }} />;
  }

  if (fileUrl.match(/\.(mp4|webm|ogg)$/i)) {
    return (
      <video controls className="video-thumbnail" style={{ maxWidth: '300px', maxHeight: '200px' }}>
        <source src={fileUrl} type={`video/${fileUrl.split('.').pop()}`} />
      </video>
    );
  }

  return (
    <div className="file-icon-preview">
      <i className="bi bi-file-earmark" style={{ fontSize: '3rem' }}></i>
      <span>Fichier sélectionné</span>
    </div>
  );
};

const FileUpload = () => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
  const location = useLocation();
  const authToken = localStorage.getItem('auth_token');
  const preselectedLevel = location.state?.preselectedLevel;

  // State management
  const [state, setState] = useState({
    levels: LEVEL_CONFIG,
    classes: [],
    filieres: [],
    subjects: [],
    courseTypes: [],
    files: [],
    loading: false,
    loadingClasses: false,
    loadingFilieres: false,
    loadingSubjects: false,
    loadingCourseTypes: false,
    loadingFiles: false
  });

  const [form, setForm] = useState({
    level_id: LEVEL_CONFIG.find(level => level.code === preselectedLevel)?.id || '',
    class_id: '',
    filiere_id: '',
    subject_id: '',
    course_type_id: '',
    lesson: '',
    category: 'S1',
    order: 0,
    youtube_link: '',
    file: null,
    file_name: ''
  });

  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // API Calls
  const fetchClasses = useCallback(async (levelId) => {
    if (!levelId) return;
    
    setState(prev => ({ ...prev, loadingClasses: true }));
    try {
      const response = await axios.get(`${apiUrl}/education/levels/${levelId}/classes`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setState(prev => ({
        ...prev,
        classes: response.data.data || [],
        loadingClasses: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, loadingClasses: false }));
      console.error("Error fetching classes:", error);
    }
  }, [apiUrl, authToken]);

  const fetchFilieres = useCallback(async (classId) => {
    if (!classId) return;
    
    setState(prev => ({ ...prev, loadingFilieres: true }));
    try {
      const response = await axios.get(`${apiUrl}/education/classes/${classId}/filieres`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setState(prev => ({
        ...prev,
        filieres: response.data.data || [],
        loadingFilieres: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, loadingFilieres: false }));
      console.error("Error fetching filieres:", error);
    }
  }, [apiUrl, authToken]);

  const fetchSubjects = useCallback(async (levelId, classId, filiereId = null) => {
    if (!levelId || !classId) {
      setState(prev => ({ ...prev, subjects: [], loadingSubjects: false }));
      return;
    }

    setState(prev => ({ ...prev, loadingSubjects: true }));

    try {
      const params = { level_id: levelId, class_id: classId };
      if (Number(levelId) === 3 && filiereId) {
        params.filiere_id = filiereId;
      }

      const response = await axios.get(`${apiUrl}/subjects`, {
        params,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      setState(prev => ({
        ...prev,
        subjects: response.data?.data || [],
        loadingSubjects: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loadingSubjects: false,
        error: error.response?.data?.message || "Erreur lors du chargement des matières"
      }));
      console.error("Erreur lors du chargement des matières :", error);
    }
  }, [apiUrl, authToken]);

  const fetchCourseTypes = useCallback(async () => {
    setState(prev => ({ ...prev, loadingCourseTypes: true }));
    
    try {
      const response = await axios.get(`${apiUrl}/course-types`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      setState(prev => ({
        ...prev,
        courseTypes: response.data.data || response.data || [],
        loadingCourseTypes: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, loadingCourseTypes: false }));
      console.error("Error fetching course types:", error);
    }
  }, [apiUrl, authToken]);

  const fetchFiles = useCallback(async () => {
    setState(prev => ({ ...prev, loadingFiles: true }));
    try {
      const params = {
        page: pagination.page,
        per_page: pagination.perPage,
        search: searchTerm,
        level_id: form.level_id
      };

      const response = await axios.get(`${apiUrl}/files`, {
        params,
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      const filteredFiles = (response.data.data || []).filter(file => 
        parseInt(file.level_id) === parseInt(form.level_id)
      );

      setState(prev => ({
        ...prev,
        files: filteredFiles,
        loadingFiles: false
      }));
      setPagination(prev => ({
        ...prev,
        total: filteredFiles.length
      }));
    } catch (error) {
      setState(prev => ({ ...prev, loadingFiles: false }));
      console.error("Error fetching files:", error);
    }
  }, [apiUrl, authToken, pagination.page, pagination.perPage, searchTerm, form.level_id]);

  // Handlers
  const handleClassChange = async (e) => {
    const classId = e.target.value;
    const newForm = {
      ...form,
      class_id: classId,
      filiere_id: '',
      subject_id: ''
    };
    
    setForm(newForm);
    setErrors(prev => ({ ...prev, class_id: undefined, filiere_id: undefined }));
    
    if (classId) {
      if (parseInt(form.level_id) === 3) {
        await fetchFilieres(classId);
      } else {
        await fetchSubjects(form.level_id, classId);
      }
    } else {
      setState(prev => ({ ...prev, filieres: [], subjects: [] }));
    }
  };

  const handleFiliereChange = async (e) => {
    const filiereId = e.target.value;
    setForm(prev => ({
      ...prev,
      filiere_id: filiereId,
      subject_id: ''
    }));
    setErrors(prev => ({ ...prev, filiere_id: undefined }));
    
    await fetchSubjects(form.level_id, form.class_id, filiereId);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, file: [validation.message] }));
      return;
    }

    setForm(prev => ({ ...prev, file, file_name: file.name }));
    setErrors(prev => ({ ...prev, file: undefined }));

    // Preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const isValidYouTubeUrl = (url) => {
    const pattern = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return pattern.test(url);
  };

  const resetForm = () => {
    setForm({
      level_id: LEVEL_CONFIG.find(level => level.code === preselectedLevel)?.id || '',
      class_id: '',
      filiere_id: '',
      subject_id: '',
      course_type_id: '',
      lesson: '',
      category: 'S1',
      order: 0,
      youtube_link: '',
      file: null,
      file_name: ''
    });
    setErrors({});
    setEditMode(false);
    setFilePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true }));
    setErrors({});

    // Validation simple
    const newErrors = {};
    if (!form.level_id) newErrors.level_id = ['Le niveau est requis'];
    if (!form.class_id) newErrors.class_id = ['La classe est requise'];
    if (parseInt(form.level_id) === 3 && !form.filiere_id) {
      newErrors.filiere_id = ['La filière est requise pour le niveau Lycée'];
    }
    if (!form.subject_id) newErrors.subject_id = ['La matière est requise'];
    if (!form.course_type_id) newErrors.course_type_id = ['Le type de cours est requis'];
    if (!form.lesson?.trim()) newErrors.lesson = ['Le nom de la leçon est requis'];

    if (!editMode && !form.file && !form.youtube_link) {
      newErrors.file = ['Un fichier ou un lien YouTube est requis'];
    }

    if (form.file && form.file.size > 50 * 1024 * 1024) {
      newErrors.file = ['La taille du fichier ne doit pas dépasser 50MB'];
    }

    if (form.youtube_link && !isValidYouTubeUrl(form.youtube_link)) {
      newErrors.youtube_link = ['Veuillez entrer une URL YouTube valide'];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const formData = new FormData();

      formData.append('level_id', form.level_id);
      formData.append('class_id', form.class_id);
      formData.append('subject_id', form.subject_id);
      formData.append('course_type_id', form.course_type_id);
      formData.append('lesson', form.lesson.trim());
      formData.append('category', form.category);
      formData.append('order', form.order || 0);

      if (parseInt(form.level_id) === 3 && form.filiere_id) {
        formData.append('filiere_id', form.filiere_id);
      }

      if (form.file) {
        formData.append('file', form.file);

        if (editMode) {
          formData.append('remove_existing_file', 'true');
        }
      } else if (editMode && !form.file_name && !form.youtube_link) {
        formData.append('remove_existing_file', 'true');
      }

      if (form.youtube_link) {
        formData.append('youtube_link', form.youtube_link.trim());
      }

      // Spoof PUT avec _method si édition
      if (editMode) {
        formData.append('_method', 'PUT');
      }

      const url = editMode ? `${apiUrl}/files/${form.id}` : `${apiUrl}/files`;

      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        title: 'Succès',
        text: editMode ? 'Fichier mis à jour avec succès' : 'Fichier uploadé avec succès',
        icon: 'success'
      });

      resetForm();
      fetchFiles();

    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      let message = "Une erreur est survenue lors de l'opération";

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        message = "Veuillez corriger les erreurs dans le formulaire";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      Swal.fire({
        title: 'Erreur',
        text: message,
        icon: 'error'
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const prepareEdit = (file) => {
    setForm({
      id: file.id,
      level_id: file.level_id,
      class_id: file.class_id,
      filiere_id: file.filiere_id || '',
      subject_id: file.subject_id,
      course_type_id: file.course_type_id,
      lesson: file.lesson,
      category: file.category || 'S1',
      order: file.order || 0,
      youtube_link: file.youtube_link || '',
      file: null,
      file_name: file.name || '',
      file_url: file.file_url || null
    });

    setEditMode(true);
    setFilePreview(file.file_url || null);
    window.scrollTo(0, 0);

    // Fetch dependent data
    fetchClasses(file.level_id);

    if (parseInt(file.level_id) === 3) {
      fetchFilieres(file.class_id);
    }

    fetchSubjects(file.level_id, file.class_id, file.filiere_id || null);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${apiUrl}/files/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      Swal.fire('Supprimé !', 'Le fichier a été supprimé.', 'success');
      fetchFiles();
    } catch (error) {
      Swal.fire('Erreur', 'La suppression a échoué', 'error');
      console.error("Delete error:", error);
    }
  };

  // Effects
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCourseTypes();
      
      if (form.level_id) {
        await fetchClasses(form.level_id);
      }
      fetchFiles();
    };

    loadInitialData();
  }, [form.level_id]);

  // Memoized components
  const ClassSelect = useMemo(() => (
    <div className={`mb-3 ${errors.class_id ? 'has-error' : ''}`}>
      <label className="form-label">Classe *</label>
      <select
        name="class_id"
        value={form.class_id}
        onChange={handleClassChange}
        className={`form-select ${errors.class_id ? 'is-invalid' : ''}`}
        disabled={!form.level_id || state.loadingClasses}
        required
      >
        <option value="">
          {state.loadingClasses ? 'Chargement...' : 'Sélectionnez une classe'}
        </option>
        {state.classes.map(classe => (
          <option key={classe.id} value={classe.id}>{classe.name}</option>
        ))}
      </select>
      {errors.class_id && (
        <div className="invalid-feedback">{errors.class_id[0]}</div>
      )}
    </div>
  ), [form.class_id, form.level_id, errors.class_id, state.classes, state.loadingClasses]);

  const FiliereSelect = useMemo(() => (
    parseInt(form.level_id) === 3 && (
      <div className={`mb-3 ${errors.filiere_id ? 'has-error' : ''}`}>
        <label className="form-label">Branche *</label>
        <select
          name="filiere_id"
          value={form.filiere_id}
          onChange={handleFiliereChange}
          className={`form-select ${errors.filiere_id ? 'is-invalid' : ''}`}
          disabled={!form.class_id || state.loadingFilieres}
          required
        >
          <option value="">
            {state.loadingFilieres ? 'Chargement...' : 'Sélectionnez une branche'}
          </option>
          {state.filieres.map(filiere => (
            <option key={filiere.id} value={filiere.id}>{filiere.name}</option>
          ))}
        </select>
        {errors.filiere_id && (
          <div className="invalid-feedback">{errors.filiere_id[0]}</div>
        )}
      </div>
    )
  ), [form.level_id, form.class_id, form.filiere_id, errors.filiere_id, state.filieres, state.loadingFilieres]);

  return (
    <div className="container mt-4">
      <h2 className='text-dark'>{editMode ? 'Modifier un fichier' : 'Ajouter un fichier'}</h2>
      
      <nav className={`navbar navbar-expand-lg navbar-light navbar-custom fixed-top ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="navbar-brand logo-image">
         
        </Link>

        <button
          className="navbar-toggler"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarsExampleDefault">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
                ACCUEIL
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/detail" className="nav-link" onClick={() => setMenuOpen(false)}>
                ABOUT
              </Link>
            </li>

            <li className={`nav-item dropdown ${dropdownOpen ? "show" : ""}`}>
              <a
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                role="button"
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
              >
                COURS
              </a>
              <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`} aria-labelledby="navbarDropdown">
                <Link to="/primaire" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  PRIMAIRE
                </Link>
                <div className="dropdown-divider"></div>
                <Link to="/college" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  COLLÈGE
                </Link>
                <div className="dropdown-divider"></div>
                <Link to="/lycee" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  LYCÉE
                </Link>
              </div>
            </li>

            <li className="nav-item">
              <Link to="/email" className="nav-link" onClick={() => setMenuOpen(false)}>
                CONTACT
              </Link>
            </li>
          </ul>

          <button className="btn btn-warning text-white" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </nav>
      
      {/* Afficher le niveau sélectionné */}
      {preselectedLevel && (
        <div className="alert alert-info mb-4">
          Niveau sélectionné : <strong>{LEVEL_CONFIG.find(l => l.code === preselectedLevel)?.name}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-5">
        {/* Niveau caché mais présent dans le formulaire */}
        <input type="hidden" name="level_id" value={form.level_id} />
        
        {ClassSelect}
        {FiliereSelect}

        {/* Subject Select */}
        <div className={`mb-3 ${errors.subject_id ? 'has-error' : ''}`}>
          <label className="form-label">Matière *</label>
          <select
            name="subject_id"
            value={form.subject_id}
            onChange={(e) => {
              setForm(prev => ({ ...prev, subject_id: e.target.value }));
              setErrors(prev => ({ ...prev, subject_id: undefined }));
            }}
            className={`form-select ${errors.subject_id ? 'is-invalid' : ''}`}
            disabled={state.loadingSubjects || !form.class_id}
            required
          >
            <option value="">
              {state.loadingSubjects ? 'Chargement...' : 'Sélectionnez une matière'}
            </option>
            {state.subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
          {errors.subject_id && (
            <div className="invalid-feedback">{errors.subject_id[0]}</div>
          )}
        </div>

        {/* Course Type Select */}
        <div className={`mb-3 ${errors.course_type_id ? 'has-error' : ''}`}>
          <label className="form-label">Type de cours *</label>
          <select
            name="course_type_id"
            value={form.course_type_id}
            onChange={(e) => {
              setForm(prev => ({ ...prev, course_type_id: e.target.value }));
              setErrors(prev => ({ ...prev, course_type_id: undefined }));
            }}
            className={`form-select ${errors.course_type_id ? 'is-invalid' : ''}`}
            disabled={state.loadingCourseTypes}
            required
          >
            <option value="">
              {state.loadingCourseTypes ? 'Chargement...' : 'Sélectionnez un type'}
            </option>
            {state.courseTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name} 
              </option>
            ))}
          </select>
          {errors.course_type_id && (
            <div className="invalid-feedback">{errors.course_type_id[0]}</div>
          )}
        </div>

        {/* Lesson Input */}
        <div className={`mb-3 ${errors.lesson ? 'has-error' : ''}`}>
          <label className="form-label">Leçon *</label>
          <input
            type="text"
            name="lesson"
            value={form.lesson}
            onChange={(e) => {
              setForm(prev => ({ ...prev, lesson: e.target.value }));
              setErrors(prev => ({ ...prev, lesson: undefined }));
            }}
            className={`form-control ${errors.lesson ? 'is-invalid' : ''}`}
            placeholder="Nom de la leçon"
            required
          />
          {errors.lesson && (
            <div className="invalid-feedback">{errors.lesson[0]}</div>
          )}
        </div>

        {/* Category Select */}
        <div className={`mb-3 ${errors.category ? 'has-error' : ''}`}>
          <label className="form-label">Catégorie *</label>
          <select
            name="category"
            value={form.category}
            onChange={(e) => {
              setForm(prev => ({ ...prev, category: e.target.value }));
              setErrors(prev => ({ ...prev, category: undefined }));
            }}
            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
            required
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {errors.category && (
            <div className="invalid-feedback">{errors.category[0]}</div>
          )}
        </div>

        {/* Order Input */}
        <div className={`mb-3 ${errors.order ? 'has-error' : ''}`}>
          <label className="form-label">Ordre d'affichage</label>
          <input
            type="number"
            name="order"
            value={form.order}
            onChange={(e) => {
              setForm(prev => ({ ...prev, order: e.target.value || 0 }));
              setErrors(prev => ({ ...prev, order: undefined }));
            }}
            className={`form-control ${errors.order ? 'is-invalid' : ''}`}
            min="0"
          />
          {errors.order && (
            <div className="invalid-feedback">{errors.order[0]}</div>
          )}
        </div>

        {/* File Input */}
        <div className={`mb-3 ${errors.file ? 'has-error' : ''}`}>
          <label className="form-label">
            Fichier {!editMode && !form.youtube_link && '*'}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className={`form-control ${errors.file ? 'is-invalid' : ''}`}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mkv"
            required={!editMode && !form.youtube_link}
          />
          {form.file_name && (
            <div className="form-text mt-1">Fichier sélectionné: {form.file_name}</div>
          )}
          <div className="form-text" style={{color: '#6c757d'}}>
            Formats acceptés : PDF, DOC, DOCX, JPG, PNG, MP4, MKV (max 50MB)
          </div>
          {errors.file && (
            <div className="invalid-feedback">{errors.file[0]}</div>
          )}
        </div>

        {/* File Preview */}
        {filePreview && (
          <div className="mb-3">
            <label className="form-label">Aperçu :</label>
            <FilePreview fileUrl={filePreview} />
          </div>
        )}

        {/* YouTube Link */}
        <div className={`mb-3 ${errors.youtube_link ? 'has-error' : ''}`}>
          <label className="form-label">
            Lien YouTube {!form.file && !editMode && '*'}
          </label>
          <input
            type="url"
            name="youtube_link"
            value={form.youtube_link}
            onChange={(e) => {
              setForm(prev => ({ ...prev, youtube_link: e.target.value }));
              setErrors(prev => ({ ...prev, youtube_link: undefined }));
            }}
            className={`form-control ${errors.youtube_link ? 'is-invalid' : ''}`}
            placeholder="https://www.youtube.com/watch?v=..."
            required={!form.file && !editMode}
          />
          {errors.youtube_link && (
            <div className="invalid-feedback">{errors.youtube_link[0]}</div>
          )}
        </div>

        {/* Form Actions */}
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn btn-warning"
            disabled={state.loading}
          >
            {state.loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                {editMode ? 'Enregistrement...' : 'Upload...'}
              </>
            ) : (
              editMode ? 'Enregistrer' : 'Télécharger'
            )}
          </button>
          
          {editMode && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={state.loading}
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Files List */}
      <div className="files-list">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Fichiers disponibles pour le niveau {LEVEL_CONFIG.find(l => l.id === parseInt(form.level_id))?.name}</h3>
          <div className="search-box d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par leçon ou matière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchFiles()}
            />
            <button 
              className="btn btn-outline-secondary ms-2"
              onClick={fetchFiles}
            >
              <i className="bi bi-search">Rechercher</i>
            </button>
          </div>
        </div>

        {state.loadingFiles ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p>Chargement des fichiers pour le niveau {LEVEL_CONFIG.find(l => l.id === parseInt(form.level_id))?.name}</p>
          </div>
        ) : state.files.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Nom</th>
                    <th>Classe</th>
                    <th>Matière</th>
                    <th>Type</th>
                    <th className='text-center '>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.files.map(file => (
                    <tr key={file.id}>
                      <td>{file.lesson}</td>
                      <td>{file.class?.name || '-'}</td>
                      <td>{file.subject?.name || '-'}</td>
                      <td>{file.course_type?.name || '-'}</td>
                      <td>
                        <div className="  d-flex gap-2 justify-content-center"> 
                          <button 
                            className=" button btn btn-sm btn-warning"
                            onClick={() => prepareEdit(file)}
                            title="Modifier"
                          >
                            <i className="bi bi-pencil"></i> Modifier
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(file.id)}
                            title="Supprimer"
                          >
                            <i className="bi bi-trash"></i> Supprimer
                          </button>
                          <a 
                            href={`${apiUrl}/files/download/${file.id}`}
                            className="btn btn-sm btn-success"
                            download
                            title="Télécharger"
                          >
                            <i className="bi bi-download"></i> Télécharger
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > pagination.perPage && (
              <nav className="d-flex justify-content-center mt-3">
                <ul className="pagination">
                  <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                    >
                      Précédent
                    </button>
                  </li>
                  
                  {Array.from({ length: Math.ceil(pagination.total / pagination.perPage) }, (_, i) => (
                    <li 
                      key={i + 1} 
                      className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}
                    >
                      <button 
                        className="page-link"
                        onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${pagination.page >= Math.ceil(pagination.total / pagination.perPage) ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}
                    >
                      Suivant
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        ) : (
          <div className="alert alert-info">
            Aucun fichier trouvé pour le niveau {LEVEL_CONFIG.find(l => l.id === parseInt(form.level_id))?.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;