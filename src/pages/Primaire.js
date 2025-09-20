import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Accordion, Button, Spinner, Form } from 'react-bootstrap';
import { 
  FaYoutube, 
  FaBook, 
  FaFileAlt, 
  FaClipboardList,
  FaDownload,
  FaStar,
  FaRegStar,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { IoIosRocket, IoMdSchool } from 'react-icons/io';
import { GiTeacher } from 'react-icons/gi';
import './primaire.css';

const Primaire = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
  
  const FILE_TYPES = useMemo(() => ({
    COURS: { name: 'cours', icon: <FaBook className="text-warning" />, color: '#FFD700' },
    SERIE: { name: 'serie', icon: <FaFileAlt className="text-success" />, color: '#4CAF50' },
    DEVOIR1: { name: 'devoir1', icon: <FaClipboardList className="text-danger" />, color: '#FF5722' },
    DEVOIR2: { name: 'devoir2', icon: <FaClipboardList className="text-danger" />, color: '#FF5722' },
    DEVOIR3: { name: 'devoir3', icon: <FaClipboardList className="text-danger" />, color: '#FF5722' },
    EXAMLOCAL: { name: 'examlocal', icon: <FaFileAlt className="text-purple" />, color: '#9C27B0' },
    EXAMREGIONAL: { name: 'examregional', icon: <FaFileAlt className="text-purple" />, color: '#9C27B0' },
    CONSEILS: { name: 'conseils', icon: <GiTeacher className="text-info" />, color: '#00BCD4' }
  }), []);

  const [state, setState] = useState({
    classes: [],
    subjects: [],
    files: { S1: {}, S2: {} },
    loadingStates: {
      classes: false,
      subjects: false,
      files: false
    },
    starredFiles: JSON.parse(localStorage.getItem('starredFiles')) || {},
    error: null,
    searchQuery: '',
    activeFilters: []
  });

  const [selections, setSelections] = useState({
    classId: '',
    subject: '',
    activeSemester: 'S1'
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const toggleStar = (fileId) => {
    const newStarredFiles = {
      ...state.starredFiles,
      [fileId]: !state.starredFiles[fileId]
    };
    setState(prev => ({ ...prev, starredFiles: newStarredFiles }));
    localStorage.setItem('starredFiles', JSON.stringify(newStarredFiles));
  };

  const toggleFilter = (filter) => {
    setState(prev => {
      const newFilters = prev.activeFilters.includes(filter)
        ? prev.activeFilters.filter(f => f !== filter)
        : [...prev.activeFilters, filter];
      
      return { ...prev, activeFilters: newFilters };
    });
  };

  const fetchClasses = useCallback(async () => {
    try {
      setState(prev => ({ 
        ...prev, 
        loadingStates: { ...prev.loadingStates, classes: true },
        error: null 
      }));
      
      const response = await axios.get(`${API_URL}/classes`, {
        params: { level: 'primaire' },
        timeout: 10000
      });
      
      setState(prev => ({
        ...prev,
        classes: response.data?.data || [],
        loadingStates: { ...prev.loadingStates, classes: false }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loadingStates: { ...prev.loadingStates, classes: false },
        error: error.response?.data?.message || "Erreur de chargement des classes"
      }));
    }
  }, [API_URL]);

  const fetchSubjects = useCallback(async (classId) => {
    if (!classId) return;

    try {
      setState(prev => ({ 
        ...prev, 
        loadingStates: { ...prev.loadingStates, subjects: true },
        error: null 
      }));
      
      const response = await axios.get(`${API_URL}/subjects`, {
        params: { 
          level_id: 1,
          class_id: classId 
        },
        timeout: 10000
      });
      
      const uniqueSubjects = [...new Set(
        response.data?.data?.map(subject => subject.name) || []
      )];
      
      setState(prev => ({
        ...prev,
        subjects: uniqueSubjects,
        loadingStates: { ...prev.loadingStates, subjects: false }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loadingStates: { ...prev.loadingStates, subjects: false },
        error: error.response?.data?.message || "Erreur de chargement des matières"
      }));
    }
  }, [API_URL]);

  const fetchFiles = useCallback(
    debounce(async (classId, subject) => {
      if (!classId || !subject) {
        setState(prev => ({ ...prev, files: { S1: {}, S2: {} } }));
        return;
      }

      try {
        setState(prev => ({ 
          ...prev, 
          loadingStates: { ...prev.loadingStates, files: true },
          error: null 
        }));
        
        const response = await axios.get(`${API_URL}/files`, {
          params: {
            level: 'primaire',
            class: classId,
            subject: subject,
            page: 1,
            per_page: 100
          },
          timeout: 10000
        });

        const organizedFiles = { S1: {}, S2: {} };
        
        (response.data?.data || []).forEach(file => {
          if (parseInt(file.class_id) !== parseInt(classId)) return;
          if (file.subject_name.toLowerCase() !== subject.toLowerCase()) return;
          
          const semester = file.category?.toUpperCase() === 'S2' ? 'S2' : 'S1';
          const lessonKey = file.lesson?.trim().toLowerCase() || 'sans-leçon';
          const fileType = file.course_type_name?.toLowerCase();

          if (!organizedFiles[semester][lessonKey]) {
            organizedFiles[semester][lessonKey] = Object.keys(FILE_TYPES)
              .reduce((acc, key) => ({ 
                ...acc, 
                [FILE_TYPES[key].name]: [] 
              }), { 
                title: file.lesson?.trim() || 'Sans leçon' 
              });
          }

          if (fileType && organizedFiles[semester][lessonKey][fileType]) {
            organizedFiles[semester][lessonKey][fileType].push({
              id: file.id,
              name: file.name,
              url: file.file_url,
              content: file.content,
              youtube_link: file.youtube_link,
              type: file.name.split('.').pop().toLowerCase(),
              date: file.created_at
            });
          }
        });

        setState(prev => ({
          ...prev,
          files: organizedFiles,
          loadingStates: { ...prev.loadingStates, files: false }
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          loadingStates: { ...prev.loadingStates, files: false },
          error: error.response?.data?.message || "Erreur de chargement des fichiers"
        }));
      }
    }, 500),
    [API_URL, FILE_TYPES]
  );

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (selections.classId) {
      fetchSubjects(selections.classId);
      setSelections(prev => ({ ...prev, subject: '' }));
    }
  }, [selections.classId, fetchSubjects]);

  useEffect(() => {
    fetchFiles(selections.classId, selections.subject);
    return () => fetchFiles.cancel();
  }, [selections.classId, selections.subject, fetchFiles]);

  const handleClassChange = (e) => {
    setSelections({
      classId: e.target.value,
      subject: '',
      activeSemester: 'S1'
    });
  };

  const handleSubjectChange = (e) => {
    setSelections(prev => ({
      ...prev,
      subject: e.target.value,
      activeSemester: 'S1'
    }));
  };

  const handleSemesterChange = (semester) => {
    setSelections(prev => ({
      ...prev,
      activeSemester: semester
    }));
  };

  const handleFileClick = useCallback(async (file) => {
    try {
      if (file.content) {
        Swal.fire({
          title: file.name,
          html: `<div class="file-content-preview">${file.content}</div>`,
          showCloseButton: true,
          width: '90%',
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#4361ee',
          background: '#ffffff',
          customClass: {
            popup: 'animated fadeIn'
          }
        });
        return;
      }

      if (!file?.id) {
        throw new Error('ID de fichier manquant');
      }

      const fileUrl = `${API_URL}/files/${file.id}/view`;
      window.open(fileUrl, '_blank', 'noopener,noreferrer');

    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Impossible d\'ouvrir le fichier. Veuillez réessayer plus tard.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4361ee'
      });
    }
  }, [API_URL]);

 
const filteredFiles = useMemo(() => {
  const semesterFiles = state.files[selections.activeSemester] || {};
  let result = {};

  Object.entries(semesterFiles).forEach(([lessonKey, lessonData]) => {
    // Vérifier d'abord si la leçon correspond à la recherche
    const lessonMatchesSearch = state.searchQuery
      ? lessonData.title.toLowerCase().includes(state.searchQuery.toLowerCase())
      : true;

    // Si la leçon ne correspond pas à la recherche, on la saute
    if (state.searchQuery && !lessonMatchesSearch) {
      return;
    }

    const filteredLesson = { ...lessonData };

    // Appliquer les filtres de type si nécessaire
    if (state.activeFilters.length > 0) {
      Object.keys(FILE_TYPES).forEach(key => {
        const typeName = FILE_TYPES[key].name;
        if (!state.activeFilters.includes(typeName)) {
          filteredLesson[typeName] = [];
        }
      });
    }

    // Vérifier si la leçon a encore des fichiers après filtrage
    const hasFiles = Object.values(FILE_TYPES).some(type => 
      (filteredLesson[type.name]?.length || 0) > 0
    );

    if (hasFiles || lessonMatchesSearch) {
      result[lessonKey] = filteredLesson;
    }
  });

  return result;
}, [state.files, selections.activeSemester, state.searchQuery, state.activeFilters, FILE_TYPES]);
  const LessonSection = React.memo(({ lessonKey, lessonData }) => {
    return (
      <motion.div 
        className="lesson-section-modern"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        layout
      >
        <div className="lesson-header-modern">
          <motion.h3 
            className="lesson-title-modern"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <IoMdSchool className="lesson-icon" />
            <span>{lessonData.title}</span>
            <motion.span 
              className="lesson-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {Object.values(FILE_TYPES).reduce(
                (total, type) => total + (lessonData[type.name]?.length || 0),
                0
              )} ressources
            </motion.span>
          </motion.h3>
        </div>

        <motion.div 
          className="file-types-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delayChildren: 0.3, staggerChildren: 0.1 }}
        >
          {Object.entries(FILE_TYPES).map(([key, type]) => {
            const files = lessonData[type.name] || [];
            if (files.length === 0) return null;

            return (
              <motion.div
                key={type.name}
                className="file-type-modern"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div 
                  className="file-type-header-modern"
                  style={{ borderLeft: `4px solid ${type.color}` }}
                >
                  <div className="file-type-icon-title">
                    {type.icon}
                    <h4 className="file-type-name-modern">
                      {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                    </h4>
                  </div>
                  <span className="file-count-badge">{files.length}</span>
                </div>

                <motion.ul 
                  className="file-list-modern"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 }
                    }
                  }}
                >
                  {files.map((file) => (
                    <motion.li
                      key={`${file.id}-${file.name}`}
                      className={`file-item-modern ${state.starredFiles[file.id] ? 'starred' : ''}`}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="file-content-modern" onClick={() => handleFileClick(file)}>
                        <div className="file-icon-type">
                          <div 
                            className="file-icon-container"
                            style={{ backgroundColor: `${type.color}20` }}
                          >
                            {file.type === 'pdf' ? (
                              <FaFileAlt style={{ color: type.color }} />
                            ) : (
                              <FaFileAlt style={{ color: type.color }} />
                            )}
                          </div>
                          <span className="file-type-badge">{file.type}</span>
                        </div>
                        
                        <div className="file-info">
                          <h5 className="file-name-modern">{file.name}</h5>
                          <span className="file-date">
                            {new Date(file.date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="file-actions-modern">
                          {file.youtube_link && (
                            <motion.a
                              href={file.youtube_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-btn youtube"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaYoutube />
                            </motion.a>
                          )}
                          <motion.button
                            className={`action-btn star ${state.starredFiles[file.id] ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(file.id);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {state.starredFiles[file.id] ? (
                              <FaStar className="star-icon filled" />
                            ) : (
                              <FaRegStar className="star-icon" />
                            )}
                          </motion.button>
                          <motion.a
                            href={`${API_URL}/files/download/${file.id}`}
                            className="action-btn download"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaDownload />
                          </motion.a>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    );
  });

  const SemesterTabs = React.memo(() => {
    return (
      <div className="semester-tabs">
        <Button
          variant={selections.activeSemester === 'S1' ? 'primary' : 'outline-primary'}
          onClick={() => handleSemesterChange('S1')}
          className="semester-tab"
        >
          Semestre 1
        </Button>
        <Button
          variant={selections.activeSemester === 'S2' ? 'primary' : 'outline-primary'}
          onClick={() => handleSemesterChange('S2')}
          className="semester-tab"
        >
          Semestre 2
        </Button>
      </div>
    );
  });

  const SearchAndFilter = React.memo(() => {
    return (
      <div className="search-filter-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
         <input
  type="text"
  placeholder="Rechercher par nom de cours..."
  value={state.searchQuery}
  onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
  className="search-input"
/>
        </div>
        <div className="filter-buttons">
          <span className="filter-label">
            <FaFilter className="me-2" />
            Filtrer:
          </span>
          {Object.values(FILE_TYPES).map(type => (
            <Button
              key={type.name}
              variant={state.activeFilters.includes(type.name) ? 'primary' : 'outline-primary'}
              onClick={() => toggleFilter(type.name)}
              size="sm"
              className="filter-btn"
            >
              {type.icon}
              <span className="filter-btn-text">
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </span>
            </Button>
          ))}
        </div>
      </div>
    );
  });

  const Selectors = React.memo(() => (
    <div className="selector-container">
      <Row>
        <Col md={6} className="mb-3">
          <Form.Group controlId="class-select">
            <Form.Label className="selector-label">Classe :</Form.Label>
            <Form.Select
              value={selections.classId}
              onChange={handleClassChange}
              disabled={state.loadingStates.classes}
              className="selector-input"
            >
              <option value="">Sélectionner une classe</option>
              {state.classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.label})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Group controlId="subject-select">
            <Form.Label className="selector-label">Matière :</Form.Label>
            <Form.Select
              value={selections.subject}
              onChange={handleSubjectChange}
              disabled={!selections.classId || state.loadingStates.subjects}
              className="selector-input"
            >
              <option value="">Sélectionner une matière</option>
              {state.subjects.map((subject, index) => (
                <option key={`${subject}-${index}`} value={subject}>
                  {subject}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </div>
  ));

  return (
    <motion.div 
      className="primaire-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header />
      <Navigation />
      
      <Container className="py-4">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="main-container">
            <h1 className="page-title text-center">
              <IoIosRocket className="rocket-icon" />
              Ressources Primaire
            </h1>
            <p className="page-subtitle text-center">
              Découvrez toutes les ressources pédagogiques pour le niveau primaire
            </p>
          </div>
        </motion.div>

        <Selectors />

        {selections.classId && selections.subject && (
          <>
            <SearchAndFilter />
            <SemesterTabs />
          </>
        )}

        <AnimatePresence>
          {state.loadingStates.files && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="loading-container"
            >
              <div className="loading-content text-center">
                <Spinner animation="border" variant="primary" className="me-2" />
                <span>Chargement des ressources...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {state.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="error-container"
          >
            <div className="error-content text-center text-danger">
              <FaFileAlt className="me-2" />
              {state.error}
            </div>
          </motion.div>
        )}

        {!state.loadingStates.files && !state.error && selections.classId && selections.subject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="files-container"
          >
            {Object.keys(filteredFiles).length === 0 ? (
              <div className="no-files-container text-center">
                <h4>Aucun fichier trouvé</h4>
                <p>Essayez de modifier vos critères de recherche ou de filtres</p>
              </div>
            ) : (
              <AnimatePresence>
                {Object.entries(filteredFiles).map(([lessonKey, lessonData]) => (
                  <LessonSection 
                    key={lessonKey} 
                    lessonKey={lessonKey} 
                    lessonData={lessonData} 
                  />
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </Container>
    </motion.div>
  );
};

export default React.memo(Primaire);