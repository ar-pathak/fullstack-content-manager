import { useEffect, useState } from 'react';
import ContentForm from './components/ContentForm';
import './App.css';

function App() {
  // Task 2: Static Content Section (Default state)
  const [previewData, setPreviewData] = useState({
    heading: 'Welcome to the Future',
    paragraph: '<p>This is the default static content block. Use the form on the left to dynamically update this section with your own text and imagery.</p>',
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop',
    color: '#ffffff'
  });

  // Task 3: Dynamic UI Updates
  const handleSuccess = (newData) => {
    setPreviewData(newData);
  };

  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const handleChange = (event) => {
      setIsMobile(event.matches);
      if (!event.matches) {
        setShowMobilePreview(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="app-container">
      {(!isMobile || !showMobilePreview) && (
        <div className="column form-column">
          <ContentForm onSuccess={handleSuccess} />
          {isMobile && (
            <button
              type="button"
              className="mobile-preview-btn"
              onClick={() => setShowMobilePreview(true)}
            >
              Show Preview
            </button>
          )}
        </div>
      )}

      {(!isMobile || showMobilePreview) && (
        <div
          className="column preview-column"
          style={{
            backgroundImage: `url(${previewData.bgImage})`,
            color: previewData.color
          }}
        >
          {isMobile && (
            <button
              type="button"
              className="mobile-back-btn"
              onClick={() => setShowMobilePreview(false)}
            >
              Back To Form
            </button>
          )}
          <div className="preview-content">
            <h1>{previewData.heading}</h1>
            {/* ReactQuill outputs HTML, so we use dangerouslySetInnerHTML to render the tags properly */}
            <div dangerouslySetInnerHTML={{ __html: previewData.paragraph }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
