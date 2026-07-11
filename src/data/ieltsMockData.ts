export interface ListeningQuestion {
  id: string;
  number: number;
  type: 'text' | 'choice' | 'boolean';
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface ListeningSection {
  id: number;
  title: string;
  audioUrl: string;
  transcript: string;
  questions: ListeningQuestion[];
}

export interface ReadingQuestion {
  id: string;
  number: number;
  type: 'text' | 'choice' | 'boolean';
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface ReadingPassage {
  id: number;
  title: string;
  content: string;
  questions: ReadingQuestion[];
}

export interface WritingTask {
  id: number;
  title: string;
  type: string;
  prompt: string;
  imagePrompt?: string; 
  minWords: number;
  suggestedTime: number;
}

export interface SpeakingSection {
  part: number;
  title: string;
  description: string;
  questions: string[];
  cueCard?: {
    topic: string;
    prompts: string[];
  };
}

export interface IELTSMockTest {
  listening: ListeningSection[];
  reading: ReadingPassage[];
  writing: WritingTask[];
  speaking: SpeakingSection[];
}

export const ieltsMockData: IELTSMockTest = {
  listening: [
    {
      id: 1,
      title: "Section 1: Library Membership Registration",
      audioUrl: "https://listenaminute.com/l/libraries.mp3",
      transcript: "Clerk: Good morning, welcome to City Central Library. How can I help you today?\nCustomer: Hello, I'd like to apply for a library membership.\nClerk: Certainly. I'll just need to take some details. First, can I have your full name?\nCustomer: Yes, it's Alex Mercer. That's A-L-E-X M-E-R-C-E-R.\nClerk: Thank you. And your address?\nCustomer: 42 Oakwood Avenue, Apartment 3B.\nClerk: Great. What is your contact number?\nCustomer: 07700 900077.\nClerk: And lastly, what is your date of birth?\nCustomer: 14th of August, 1995.\nClerk: Perfect. Your card will be ready in five minutes.",
      questions: [
        { id: "l1", number: 1, type: "text", question: "Write the applicant's surname: (capital letters)", correctAnswer: "MERCER" },
        { id: "l2", number: 2, type: "text", question: "Write the Street name: Oakwood ...", correctAnswer: "AVENUE" },
        { id: "l3", number: 3, type: "text", question: "Write the Apartment number: ...", correctAnswer: "3B" },
        { id: "l4", number: 4, type: "text", question: "Write the applicant's year of birth: ...", correctAnswer: "1995" },
        { id: "l5", number: 5, type: "choice", question: "Which section of the library does the user want to access most?", options: ["Academic Books", "Fiction Novels", "Newspapers & Journals"], correctAnswer: "Academic Books" },
        { id: "l6", number: 6, type: "text", question: "The user is registered as a ... (write: Student, Employee, or Pensioner)", correctAnswer: "STUDENT" }
      ]
    },
    {
      id: 2,
      title: "Section 2: Tour of the National Marine Park",
      audioUrl: "https://listenaminute.com/e/environment.mp3",
      transcript: "Guide: Welcome everyone to the National Marine Park! Today I'll outline our main rules and attractions. Firstly, the visitors center is open from 9 AM to 6 PM daily. Swimming is strictly prohibited in the coral conservation zone, which is marked in red on your maps. If you want to see the sea turtles, the best time to visit the Sandy Bay area is at 2 PM during high tide. Finally, please do not feed any wildlife as it disrupts their natural diet.",
      questions: [
        {
          id: "l7", number: 7, type: "choice", question: "What time does the visitors center close?",
          options: ["5:00 PM", "6:00 PM", "7:00 PM"], correctAnswer: "6:00 PM"
        },
        {
          id: "l8", number: 8, type: "boolean", question: "Swimming is allowed in the coral conservation zone.",
          options: ["TRUE", "FALSE"], correctAnswer: "FALSE"
        },
        {
          id: "l9", number: 9, type: "text", question: "At what time is it best to see the sea turtles? ... PM", correctAnswer: "2"
        },
        {
          id: "l10", number: 10, type: "text", question: "Name of the turtles' observation bay: ... Bay", correctAnswer: "SANDY" },
        {
          id: "l11", number: 11, type: "boolean", question: "Visitors are allowed to feed fish and marine life.",
          options: ["TRUE", "FALSE"], correctAnswer: "FALSE"
        },
        {
          id: "l12", number: 12, type: "choice", question: "The park entrance fee for students is:",
          options: ["Free", "$10", "$15"], correctAnswer: "$10"
        }
      ]
    },
    {
      id: 3,
      title: "Section 3: Student Academic Tutorial",
      audioUrl: "https://listenaminute.com/e/education.mp3",
      transcript: "Tutor: Good afternoon Sarah and Liam. I wanted to check in on your joint psychology presentation for next week. How is the research going?\nSarah: Hi Dr. Green. We've gathered most of the data on cognitive development in infants. Liam did the surveys.\nLiam: Yes, we surveyed fifty local families. We found that screen time under two years old was strongly correlated with delayed language acquisition. \nTutor: Interesting. Have you prepared the slides?\nSarah: Liam is working on the data graphs, and I am drafting the literature review slides. We should be finished by Friday.\nTutor: Excellent. Make sure to limit the presentation to fifteen minutes.",
      questions: [
        { id: "l13", number: 13, type: "text", question: "What is the topic of the psychology presentation? Cognitive ...", correctAnswer: "DEVELOPMENT" },
        { id: "l14", number: 14, type: "text", question: "How many local families did the students survey?", correctAnswer: "50" },
        { id: "l15", number: 15, type: "choice", question: "What delay was correlated with excessive infant screen time?", options: ["Social Development", "Language Acquisition", "Motor Skills"], correctAnswer: "Language Acquisition" },
        { id: "l16", number: 16, type: "text", question: "Who is drafting the literature review slides?", correctAnswer: "SARAH" },
        { id: "l17", number: 17, type: "text", question: "What is the maximum duration for the presentation in minutes?", correctAnswer: "15" },
        { id: "l18", number: 18, type: "boolean", question: "The students plan to finish their slides on Saturday.", options: ["TRUE", "FALSE"], correctAnswer: "FALSE" }
      ]
    },
    {
      id: 4,
      title: "Section 4: Lecture on the History of Mapmaking",
      audioUrl: "https://listenaminute.com/g/geography.mp3",
      transcript: "Lecturer: Good morning. Today we will explore cartography, the science of mapmaking. The earliest known maps date back to 6000 BC in Anatolia. These early representations were not scientific, but rather served ritualistic or local hunting purposes. In the 2nd century AD, Ptolemy revolutionized mapmaking by introducing a coordinate system of latitude and longitude. Later, during the Renaissance, the Mercator projection became the standard for ocean navigation due to its ability to represent lines of constant course as straight segments.",
      questions: [
        { id: "l19", number: 19, type: "text", question: "The earliest maps date back to 6000 BC in which region?", correctAnswer: "ANATOLIA" },
        { id: "l20", number: 20, type: "choice", question: "What did Ptolemy introduce to mapmaking in the 2nd century AD?", options: ["Compass Rose", "Coordinate System", "Scale Bar"], correctAnswer: "Coordinate System" },
        { id: "l21", number: 21, type: "text", question: "Ptolemy introduced latitude and ...", correctAnswer: "LONGITUDE" },
        { id: "l22", number: 22, type: "text", question: "Which map projection became the standard for ocean navigation?", correctAnswer: "MERCATOR" },
        { id: "l23", number: 23, type: "boolean", question: "Early maps before the 2nd century were highly scientific.", options: ["TRUE", "FALSE"], correctAnswer: "FALSE" },
        { id: "l24", number: 24, type: "choice", question: "The Mercator projection represents course lines as:", options: ["Curves", "Straight segments", "Grid lines"], correctAnswer: "Straight segments" }
      ]
    }
  ],
  reading: [
    {
      id: 1,
      title: "Passage 1: The Rise of AI in Modern Education",
      content: `The integration of Artificial Intelligence (AI) into classrooms has accelerated rapidly over the past decade. Traditional one-size-fits-all education models are being replaced by personalized learning systems that adapt to the individual pace of each student.\n\nAI systems analyze student performance in real-time, identifying areas where a student struggles and dynamically adjusting the difficulty of tasks. For example, if a student is learning algebra and fails to understand quadratic equations, the AI tutor detects this bottleneck and offers foundational arithmetic exercises before proceeding. This targeted support prevents students from falling behind.\n\nHowever, critics raise concerns regarding data privacy and the loss of human interaction. They argue that algorithms cannot replace the emotional intelligence, mentorship, and inspiration provided by human teachers. A balanced approach, where AI acts as an assistant to human instructors rather than a replacement, is widely considered the most effective path forward.`,
      questions: [
        {
          id: "r1", number: 1, type: "boolean",
          question: "AI adapts the difficulty of learning tasks based on individual student performance.",
          options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "TRUE"
        },
        {
          id: "r2", number: 2, type: "boolean",
          question: "Critics argue that AI can replicate the emotional intelligence of human teachers.",
          options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "FALSE"
        },
        {
          id: "r3", number: 3, type: "choice",
          question: "What is considered the most effective way to implement AI in education?",
          options: [
            "Replacing teachers entirely with AI tutors",
            "Using AI as an assistant to support human instructors",
            "Banning AI to protect student data privacy"
          ], correctAnswer: "Using AI as an assistant to support human instructors"
        },
        {
          id: "r4", number: 4, type: "text",
          question: "Which mathematics topic is given as an example of AI bottleneck detection?",
          correctAnswer: "ALGEBRA"
        },
        {
          id: "r5", number: 5, type: "boolean",
          question: "All teachers agree that AI will completely replace school classrooms by 2030.",
          options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "NOT GIVEN"
        },
        {
          id: "r6", number: 6, type: "text",
          question: "Critics' main concern, other than human interaction, is student data ...",
          correctAnswer: "PRIVACY"
        }
      ]
    },
    {
      id: 2,
      title: "Passage 2: The Secrets of Deep-Sea Hydrothermal Vents",
      content: `Deep below the ocean surface, where sunlight cannot penetrate, lie hydrothermal vents—fissures on the seafloor that geothermally heat water. Discovered in 1977, these vents support unique ecosystems that completely bypass photosynthesis. Instead, they rely on chemosynthesis, a process where microbes convert chemical energy from the mineral-rich fluids into organic matter.\n\nThese ecosystems thrive under extreme hydrostatic pressure and temperatures exceeding 400 degrees Celsius. Scientists have discovered giant tube worms, blind crabs, and specialized shrimp that survive nowhere else on Earth. Studying these organisms provides critical insights into the origins of life on Earth and potential extraterrestrial life on icy moons like Jupiter's Europa.`,
      questions: [
        {
          id: "r7", number: 7, type: "text",
          question: "In what year were hydrothermal vents first discovered?",
          correctAnswer: "1977"
        },
        {
          id: "r8", number: 8, type: "boolean",
          question: "Deep-sea ecosystems rely on photosynthesis for energy.",
          options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "FALSE"
        },
        {
          id: "r9", number: 9, type: "choice",
          question: "Which moon is mentioned as potentially having extraterrestrial life?",
          options: ["Titan", "Europa", "Ganymede"], correctAnswer: "Europa"
        },
        {
          id: "r10", number: 10, type: "text",
          question: "Name one of the crustacean species found near vents: ... crabs",
          correctAnswer: "BLIND"
        },
        {
          id: "r11", number: 11, type: "text",
          question: "Hydrothermal fluids can exceed temperatures of ... degrees Celsius.",
          correctAnswer: "400"
        },
        {
          id: "r12", number: 12, type: "boolean",
          question: "Giant tube worms can survive in warm tropical surface waters.",
          options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "FALSE"
        }
      ]
    },
    {
      id: 3,
      title: "Passage 3: The Evolution of Language and Speech",
      content: `How did language begin? This question remains one of the greatest mysteries in human science. Evolutionary linguists believe that the transition from animal vocalizations to complex syntax occurred roughly 100,000 years ago, coinciding with the biological enlargement of the human brain.\n\nUnlike chimpanzees, who possess a limited range of distinct sounds, early humans developed a flexible vocal tract and a specialized gene known as FOXP2, which is associated with speech motor control. This enabled the articulation of distinct vowels and consonants. Social structures also played an important role: as tribes expanded, the need for cooperative planning, hunting, and storytelling drove the complexity of semantic structures. Today, the world has over 7,000 distinct languages, though global integration is causing many endangered languages to face extinction.`,
      questions: [
        { id: "r13", number: 13, type: "text", question: "Evolutionary linguists estimate complex syntax began ... years ago.", correctAnswer: "100000" },
        { id: "r14", number: 14, type: "text", question: "Which specific gene is associated with human speech motor control?", correctAnswer: "FOXP2" },
        { id: "r15", number: 15, type: "choice", question: "What social activity drove language complexity according to the text?", options: ["Trade and Barter", "Storytelling and Cooperative Planning", "Territorial Defense"], correctAnswer: "Storytelling and Cooperative Planning" },
        { id: "r16", number: 16, type: "text", question: "Approximately how many distinct languages exist in the world today?", correctAnswer: "7000" },
        { id: "r17", number: 17, type: "boolean", question: "Chimpanzees possess the biological capability to speak human words.", options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "FALSE" },
        { id: "r18", number: 18, type: "boolean", question: "Endangered languages are thriving due to the growth of global internet networks.", options: ["TRUE", "FALSE", "NOT GIVEN"], correctAnswer: "FALSE" }
      ]
    }
  ],
  writing: [
    {
      id: 1,
      title: "Writing Task 1: Academic Report",
      type: "Task 1",
      prompt: "The bar chart below compares the percentage of internet users in three countries (Uzbekistan, South Korea, and Germany) between 2010 and 2025. Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      imagePrompt: "Internet users chart: South Korea: 2010 (80%), 2025 (98%); Germany: 2010 (75%), 2025 (92%); Uzbekistan: 2010 (15%), 2025 (70%). Uzbekistan shows the fastest growth rate.",
      minWords: 150,
      suggestedTime: 20
    },
    {
      id: 2,
      title: "Writing Task 2: Opinion Essay",
      type: "Task 2",
      prompt: "Some people believe that traditional brick-and-mortar classrooms will completely disappear in the future, replaced entirely by online learning platforms. To what extent do you agree or disagree with this statement? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      suggestedTime: 40
    }
  ],
  speaking: [
    {
      part: 1,
      title: "Part 1: Introduction & Interview",
      description: "Familiar topics such as home, studies, hobbies, and career plans.",
      questions: [
        "Let's talk about where you live. Do you live in a house or an apartment?",
        "What do you like most about your hometown?",
        "Do you prefer studying in the morning or in the evening? Why?"
      ]
    },
    {
      part: 2,
      title: "Part 2: Cue Card (Long Turn)",
      description: "Speak for 1-2 minutes about a topic. You have 1 minute to prepare.",
      cueCard: {
        topic: "Describe a book you read recently that you found useful.",
        prompts: [
          "What the book was about",
          "When and why you read it",
          "What you learned from it",
          "Explain why you found it useful."
        ]
      },
      questions: []
    },
    {
      part: 3,
      title: "Part 3: Discussion (Abstract Questions)",
      description: "In-depth questions expanding on the Part 2 topic.",
      questions: [
        "Do you think paper books will eventually be replaced by digital ebooks?",
        "Why is it important for children to develop a habit of reading early in life?",
        "How has the internet changed the way people consume information compared to the past?"
      ]
    }
  ]
};
