import { useState } from 'react';
import testRov from '../assets/graphs/test_rov.jpg';
import valCon from '../assets/graphs/val_con.jpg';
import trainRov from '../assets/graphs/train_rov.jpg';
import trainCon from '../assets/graphs/train_con.jpg';
import trainLoss from '../assets/graphs/train_loss.jpg';

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    fontSize: '2rem',
    color: 'white',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  graphGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    padding: '1rem'
  },
  graphCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-5px)'
    }
  },
  graphImage: {
    width: '100%',
    height: 'auto',
    display: 'block'
  },
  graphInfo: {
    padding: '1.5rem'
  },
  graphTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#333'
  },
  graphDescription: {
    color: '#666',
    fontSize: '0.9rem',
    lineHeight: '1.5'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    maxWidth: '90%',
    maxHeight: '90vh',
    position: 'relative'
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '90vh',
    objectFit: 'contain'
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.7)'
    }
  }
};

const graphs = [
  {
    id: 1,
    title: 'Test ROV Graph',
    description: 'This graph shows the test results of the ROV (Region of Violence) detection model.',
    image: testRov
  },
  {
    id: 2,
    title: 'Validation Convergence Graph',
    description: 'This graph displays the convergence of the validation metrics during model training.',
    image: valCon
  },
  {
    id: 3,
    title: 'Training ROV Graph',
    description: 'This graph illustrates the ROV detection performance during the training phase.',
    image: trainRov
  },
  {
    id: 4,
    title: 'Training Convergence Graph',
    description: 'This graph shows the convergence of training metrics over time.',
    image: trainCon
  },
  {
    id: 5,
    title: 'Training Loss Graph',
    description: 'This graph displays the loss function values during the training process.',
    image: trainLoss
  }
];

function Graphs() {
  const [selectedGraph, setSelectedGraph] = useState(null);

  const handleGraphClick = (graph) => {
    setSelectedGraph(graph);
  };

  const handleCloseModal = () => {
    setSelectedGraph(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Model Performance Graphs</h1>
      <div style={styles.graphGrid}>
        {graphs.map((graph) => (
          <div 
            key={graph.id} 
            style={styles.graphCard}
            onClick={() => handleGraphClick(graph)}
          >
            <img 
              src={graph.image} 
              alt={graph.title}
              style={styles.graphImage}
            />
            <div style={styles.graphInfo}>
              <h3 style={styles.graphTitle}>{graph.title}</h3>
              <p style={styles.graphDescription}>{graph.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedGraph && (
        <div style={styles.modal} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={handleCloseModal}>×</button>
            <img 
              src={selectedGraph.image} 
              alt={selectedGraph.title}
              style={styles.modalImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Graphs; 