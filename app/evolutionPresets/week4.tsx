import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { LineChart } from 'react-native-chart-kit';

const profile = require('../../assets/images/vecteezy_ai-generated-beautiful-young-primary-school-teacher-at_32330362 (1).jpg');
const week4Image = require('../../assets/images/4week 1.png');

// Sample data for the weight chart (in kg)
const data = {
  labels: ['Day 22', 'Day 23', 'Day 24', 'Day 25', 'Day 26', 'Day 27', 'Day 28'],
  datasets: [
    {
      data: [3.2, 3.25, 3.3, 3.35, 3.4, 3.45, 3.5], // Approximate weight changes based on average growth rates
    },
  ],
};

const BabyInfoScreen = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="cancel" size={30} color="#000" onPress={() => router.push('/(tabs)/evolution')} />
          <Text style={styles.headerText}>Evolution</Text>
        </View>

        <View style={styles.weeksContainer}>
          <TouchableOpacity onPress={() => router.push('/evolutionPresets/week1' as any)}>
            <View style={styles.week1}>
              <Text style={styles.weekNumber}>1</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/evolutionPresets/week2' as any)}>
            <View style={styles.week1}>
              <Text style={styles.weekNumber}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/evolutionPresets/week3' as any)}>
            <View style={styles.week1}>
              <Text style={styles.weekNumber}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/evolutionPresets/week4' as any)}>
            <View style={styles.week1s}>
              <Text style={styles.weekNumber}>4</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/evolutionPresets/week5' as any)}>
            <View style={styles.week1}>
              <Text style={styles.weekNumber}>5</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/evolutionPresets/week6' as any)}>
            <View style={styles.week1}>
              <Text style={styles.weekNumber}>6</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/evolutionPresets/week7' as any)}>
            <View style={styles.week1}>
              <Text style={styles.weekNumber}>7</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/evolutionPresets/week8' as any)}>
            <View style={styles.week1}>
              <Text style={styles.weekNumber}>8</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Image and Details */}
        <View style={styles.content}>
          <View style={styles.wholeContainer}>
            <Image source={week4Image} style={styles.weekimage} />
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>WEEK - 4</Text>
              <Text style={styles.infoText}>Height:</Text>
              <Text style={styles.infoText1}>46.1 - 56.7 cm</Text>
              <Text style={styles.infoText}>Weight:</Text>
              <Text style={styles.infoText1}>3.11 - 5.01 kg</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Your newborn in week 4</Text>
          <Text style={styles.sectionContent}>
            “Welcome to the fourth week with your little one! You’ve officially completed the first month of parenthood—amazing job! By now, you might see your baby making brief eye contact or responding to your voice. It’s a time filled with tiny yet meaningful changes. Continue to lean into your support system, rest when you can, and cherish those moments of connection with your baby.”
          </Text>

          <Text style={styles.sectionTitle}>Respiratory system</Text>
          <Text style={styles.sectionContent}>
            In the fourth week, the baby’s respiratory system is more stable, and breathing patterns are becoming more consistent. While periodic breathing may still occur, these instances are generally less frequent. The baby continues to breathe primarily through their nose, which is crucial for feeding. Watch for any persistent signs of discomfort, such as grunting or retractions.
          </Text>

          <Text style={styles.sectionTitle}>Digestive system</Text>
          <Text style={styles.sectionContent}>
            By the fourth week, the digestive system is better adjusted to processing breast milk or formula. Bowel movements become more predictable, although variations still occur. Breastfed babies often have loose, yellow stools, while formula-fed babies may have thicker, brownish stools. As digestion matures, signs of gas or discomfort may lessen.
          </Text>

          <Text style={styles.sectionTitle}>Weight</Text>
          <Text style={styles.sectionContent}>
            Most babies have surpassed their birth weight by now and continue to gain 150-200 grams (5-7 ounces) weekly. Pediatricians check the baby’s weight to ensure steady growth. Parents may notice their little one filling out with chubby cheeks and rolls on arms and legs as fat stores develop.
          </Text>

          <Text style={styles.sectionTitle}>Skin</Text>
          <Text style={styles.sectionContent}>
            The skin appears smoother and less flaky as newborn rashes like erythema toxicum or baby acne fade. Some babies develop cradle cap—yellowish, scaly patches on the scalp—which typically resolves over time. A gentle hair-washing routine can help minimize it. Continue to protect the baby’s skin from harsh products and excess sun exposure.
          </Text>

          <Text style={styles.sectionTitle}>Sleep</Text>
          <Text style={styles.sectionContent}>
            Sleep patterns may slightly improve as the baby adjusts to a day-night cycle, but 14-17 total hours of sleep is still normal. You might observe longer stretches at night, though frequent feedings remain common. A calm bedtime routine can help establish healthier sleep habits going forward.
          </Text>

          <Text style={styles.sectionTitle}>Mood</Text>
          <Text style={styles.sectionContent}>
            Your baby might be more responsive and alert for longer periods, cooing and focusing on faces or voices. Crying is still the main form of communication, but parents may start spotting patterns in fussiness or engagement. Growth spurts can trigger increased crying or feeding.
          </Text>

          <Text style={styles.sectionTitle}>Genitals</Text>
          <Text style={styles.sectionContent}>
            Maternal hormone effects typically diminish by week four. Swelling of the scrotum in male babies or labial swelling in females usually decreases. Any breast lumps also subside. Gentle cleansing routines help maintain healthy skin and reduce the risk of irritation.
          </Text>
        </View>

        {/* Graph Section */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Approximate Weight Changes</Text>
          <LineChart
            data={data}
            width={Dimensions.get('window').width - 70}
            height={220}
            chartConfig={{
              backgroundColor: '#f2f2f2',
              backgroundGradientFrom: '#f2f2f2',
              backgroundGradientTo: '#cfcfcf',
              color: (opacity = 1) => `rgba(0, 120, 164, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Text style={styles.graphText}>
            A hypothetical progression of weight changes from the fourth week.
          </Text>
        </View>

        {/* External Links */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Useful Resources</Text>
          <Text style={styles.link}>
            •{' '}
            <Text
              style={styles.linkText}
              onPress={() => Linking.openURL('https://www.cdc.gov/parents/infants')}
            >
              CDC: Infant and Toddler Health
            </Text>
          </Text>
          <Text style={styles.link}>
            •{' '}
            <Text
              style={styles.linkText}
              onPress={() => Linking.openURL('https://www.healthychildren.org/')}
            >
              HealthyChildren: 1-Month-Old Baby Care
            </Text>
          </Text>
          <Text style={styles.link}>
            •{' '}
            <Text
              style={styles.linkText}
              onPress={() => Linking.openURL('https://www.whattoexpect.com/first-year/week-by-week/week-4/')}
            >
              WhatToExpect: Week 4 Overview
            </Text>
          </Text>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    right: 130,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  weeksContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-evenly',
  },
  week1: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexDirection: 'row',
  },
  week1s: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CBE6F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexDirection: 'row',
  },
  weekNumber: {
    fontSize: 16,
    color: '#0078A4',
  },
  wholeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    marginBottom: -19,
  },
  weekimage: {
    width: '47%',
    height: 193,
    borderRadius: 8,
  },
  infoBox: {
    marginVertical: 16,
    backgroundColor: '#D8D8D8',
    width: '47%',
    height: 193,
    borderRadius: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    margin: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoText1: {
    fontWeight: '300',
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  graphText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  link: {
    marginVertical: 4,
    fontSize: 16,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default BabyInfoScreen;