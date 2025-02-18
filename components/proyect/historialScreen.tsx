import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

export default function HistorialScreen() {
  const [modalVisible, setModalVisible] = React.useState(false); // El modal estará cerrado inicialmente

  const handleShowModal = () => {
    setModalVisible(true); // Mostrar el modal cuando se haga clic en el lugar
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Cerrar el modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de actividad</Text>

      {/* Nombre de un lugar - al hacer clic se mostrará el modal */}
      <TouchableOpacity style={styles.placeButton} onPress={handleShowModal}>
        <Text style={styles.placeButtonText}>Lugar: Parque Central</Text>
      </TouchableOpacity>

      {/* Modal Estático */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Datos del Sensor</Text>
            
            <Text style={styles.modalText}>Temperatura: 22°C</Text>
            <Text style={styles.modalText}>Humedad: 60%</Text>
            <Text style={styles.modalText}>Gases: Bajo</Text>

            {/* Botón para cerrar el modal */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding:16,
    marginTop:16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
  },
  // Estilos para el lugar (botón que será clickeable)
  placeButton: {
    padding: 12,
    backgroundColor: '#4CAF50', // Color verde
    borderRadius: 8,
    marginBottom: 20,
  },
  placeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro translúcido
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3', // Color de fondo del botón
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
