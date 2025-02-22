import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function StatisticsScreen() {
  const totalAlerts = {
    motion: 14,
    fire: 3,
    smoke: 5,
  };

  const chartData = {
    labels: ["Movimiento", "Fuego", "Humo"],
    datasets: [
      {
        data: [totalAlerts.motion, totalAlerts.fire, totalAlerts.smoke],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estadísticas</Text>

      <View style={styles.alertSummary}>
        <View style={styles.alertBox}>
          <Ionicons name="walk" size={30} color="#FF6B00" />
          <Text style={styles.alertText}>{totalAlerts.motion} Movimientos</Text>
        </View>
        <View style={styles.alertBox}>
          <Ionicons name="flame" size={30} color="red" />
          <Text style={styles.alertText}>{totalAlerts.fire} Incendios</Text>
        </View>
        <View style={styles.alertBox}>
          <Ionicons name="cloud" size={30} color="gray" />
          <Text style={styles.alertText}>{totalAlerts.smoke} Alertas de Humo</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Tendencia de Alertas</Text>
      <BarChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel="$" // Agrega un símbolo antes del número (opcional)
        yAxisSuffix="k" // Agrega un sufijo (opcional)
        chartConfig={{
          backgroundGradientFrom: "#1E1E1E",
          backgroundGradientTo: "#1E1E1E",
          color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          barPercentage: 0.5,
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF6B00",
    marginBottom: 20,
  },
  alertSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  alertBox: {
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 10,
    width: "30%",
  },
  alertText: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFF",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 10,
  },
});
