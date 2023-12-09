import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Iconify } from "react-native-iconify";
import styles from "./pl";
import { ScrollView } from "react-native-gesture-handler";

const PoliciesScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Policies</Text>
      <View style={styles.line} />

      <View style={styles.insideContainer}>
        <Text style={styles.topTitle}>Republic Act No. 10173</Text>
        <Text style={styles.titleDesc}>
          {"          "}According to the Senate and House of Representatives
          (2012), Republic Act 10173, otherwise known as the Data Privacy Act of
          2012, is a law that protects people's private information while
          allowing information to flow in order to promote growth.{"\n\n"}
          {"          "}All personal information maintained by the government,
          its agencies, and employers must always be confidential and private.
          It further enforces that data collection requires consent and
          authorization, which individuals must provide freely.{"\n\n"}
          {"          "}Moreover, this law governs how entities protect personal
          data throughout the Philippines. The processes involved the following;
          the law applies to all entities that process personal data, including
          corporations, government organizations, and people living inside and
          outside the Philippines. To maintain the privacy of personal
          information, they must abide by the law's requirements. Entities can
          only acquire personal data legally with the data subject's consent.
          {"\n\n"}
          {"          "}Organizations handling personal data must establish a
          Data Privacy Officer (DPO) to manage data protection compliance and
          handle data-related problems.
          {"\n\n"}
          {"          "}Entities must disclose the goal, scope, and data
          processing mode to the data subject. Individuals are given certain
          rights under the law, including the ability to access their data,
          remedy errors, and receive notification of any data breaches that
          might compromise their personal information. Organizations handling
          personal data must take security precautions to prevent unauthorized
          access, disclosure, modification, and destruction of that data.
          {"\n\n"}
          {"          "}They must notify the National Privacy Commission (NPC)
          and any impacted persons if a data breach poses a severe risk to the
          rights and freedoms of the data subject. Lastly, organizations must
          ensure that the recipient nation offers an acceptable degree of data
          protection or has the data subject's approval before transferring
          personal information outside the Philippines. These processes and
          guidelines must be adhered to help ensure that the protection of
          personal data is legal and compliant.
          {"\n\n"}
          {"          "}With the legal basis provided, it is necessary to
          observe and adhere since the proposed system involves dispensing
          medications, which requires disclosing personal data and protected
          health information. It is to assure the safety of the consumers along
          the run.
          {"\n\n"}
        </Text>
        <Text style={styles.topTitle}>Republic Act No. 10918</Text>
        <Text style={styles.titleDesc2}>
          {"          "}There is a law that legally supports the study wherein
          the state acknowledges the vital role pharmacists play in delivering
          high-quality healthcare services, including pharmaceutical treatment,
          drug information, and patient counseling. Health care services by
          offering pharmaceutical care, safe, effective, and high-quality
          pharmaceutical goods, drug information, patient medication counseling,
          and health promotions. To ensure the physical well-being of Filipinos,
          promoting the professional services of pharmacists as a vital part
          must be prioritized in the nation's comprehensive healthcare system.
          Therefore, through regulatory measures, programs, and initiatives that
          support and sustain their ongoing professional development, the state
          will produce and nurture competent, effective, morally responsible,
          and well-rounded pharmacists whose professional practice and service
          standards shall be excellent and globally competitive.{"\n\n"}
          {"          "}According to the law, a person practices pharmacy when
          they receive a fee, salary, percentage, or other rewards that someone
          pays or delivers directly or indirectly. All pharmacists must conform
          to the most recent regulations, including the Philippine Practice
          Standards for Pharmacists, Good Laboratory Practice, Good Distribution
          Practice, Good Manufacturing Practice, and Good Clinical Practice,
          which are necessary to accomplish their duties in various practice
          areas. The law requires pharmacists to be registered and licensed by
          the Professional Regulation Commission (PRC) before practicing their
          profession legally in the Philippines.{"\n\n"}
          {"          "}The legislation sets forth the standards and
          qualifications to own and manage a pharmacy. It attempts to ensure
          that pharmacists who are adequately trained and licensed are in charge
          of pharmacies. To preserve public health and combat drug abuse,
          people, in general, are subject to regulations on the sale and
          distribution of prescription and over-the-counter medications by the
          law. The law lays out guidelines for importing, selling, and
          distributing pharmaceutical goods in the Philippines. It indicates
          unlawful practices in pharmacy, such as selling out-of-date
          medications, unregistered medications, and participating in illicit
          drug trafficking.
          {"\n\n"}
        </Text>
      </View>
    </ScrollView>
  );
};

export default PoliciesScreen;
