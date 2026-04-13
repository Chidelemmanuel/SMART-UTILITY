import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  TextInput,
  Dimensions,
  Platform
} from 'react-native';
import { 
  Ruler, 
  StickyNote, 
  Calculator as CalcIcon, 
  ChevronLeft,
  LayoutGrid,
  Plus,
  Trash2,
  Scale,
  Thermometer,
  ArrowRightLeft
} from 'lucide-react';

const { width } = Dimensions.get('window');

// --- Types ---
type Tool = 'dashboard' | 'converter' | 'notes' | 'calculator';

// --- Components ---

const Dashboard = ({ onSelect }: { onSelect: (tool: Tool) => void }) => {
  const tools = [
    { id: 'converter' as Tool, title: 'Unit Converter', icon: Ruler, color: '#3b82f6' },
    { id: 'notes' as Tool, title: 'Smart Notes', icon: StickyNote, color: '#f59e0b' },
    { id: 'calculator' as Tool, title: 'Calculator', icon: CalcIcon, color: '#10b981' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.dashboardContainer}>
      <Text style={styles.headerTitle}>Utility Toolkit</Text>
      <Text style={styles.headerSubtitle}>Essential tools for your daily tasks</Text>
      
      <View style={styles.grid}>
        {tools.map((tool) => (
          <TouchableOpacity 
            key={tool.id} 
            style={[styles.toolCard, { borderLeftColor: tool.color }]}
            onPress={() => onSelect(tool.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: tool.color + '20' }]}>
              <tool.icon size={24} color={tool.color} />
            </View>
            <Text style={styles.toolTitle}>{tool.title}</Text>
            <Text style={styles.toolDesc}>Tap to open</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const UnitConverter = () => {
  const [value, setValue] = useState('1');
  const [category, setCategory] = useState('length');
  
  // Simplified conversion for demo
  const result = parseFloat(value) * 1.60934; // Miles to KM example

  return (
    <View style={styles.toolView}>
      <Text style={styles.toolHeader}>Unit Converter</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Miles</Text>
        <TextInput 
          style={styles.input}
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.arrowContainer}>
        <ArrowRightLeft size={24} color="#666" />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Kilometers</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{isNaN(result) ? '0' : result.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const Notes = () => {
  const [notes, setNotes] = useState<{id: string, text: string}[]>([]);
  const [currentNote, setCurrentNote] = useState('');

  const addNote = () => {
    if (currentNote.trim()) {
      setNotes([{ id: Date.now().toString(), text: currentNote }, ...notes]);
      setCurrentNote('');
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <View style={styles.toolView}>
      <Text style={styles.toolHeader}>Smart Notes</Text>
      <View style={styles.noteInputRow}>
        <TextInput 
          style={[styles.input, { flex: 1 }]}
          placeholder="Type a note..."
          value={currentNote}
          onChangeText={setCurrentNote}
        />
        <TouchableOpacity style={styles.addButton} onPress={addNote}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.notesList}>
        {notes.map(note => (
          <View key={note.id} style={styles.noteCard}>
            <Text style={styles.noteText}>{note.text}</Text>
            <TouchableOpacity onPress={() => deleteNote(note.id)}>
              <Trash2 size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  
  const handlePress = (val: string) => {
    if (val === '=') {
      try {
        // Simple eval-like logic for basic math
        const result = eval(equation + display);
        setDisplay(String(result));
        setEquation('');
      } catch (e) {
        setDisplay('Error');
      }
    } else if (['+', '-', '*', '/'].includes(val)) {
      setEquation(display + val);
      setDisplay('0');
    } else {
      if (display === '0') setDisplay(val);
      else setDisplay(display + val);
    }
  };

  return (
    <View style={styles.toolView}>
      <Text style={styles.toolHeader}>Calculator</Text>
      <View style={styles.calcDisplay}>
        <Text style={styles.calcEquationText}>{equation}</Text>
        <Text style={styles.calcDisplayText}>{display}</Text>
      </View>
      <View style={styles.calcGrid}>
        {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(btn => (
          <TouchableOpacity 
            key={btn} 
            style={[styles.calcBtn, btn === '=' && { backgroundColor: '#3b82f6' }]}
            onPress={() => handlePress(btn)}
          >
            <Text style={[styles.calcBtnText, btn === '=' && { color: '#fff' }]}>{btn}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.calcBtn, { width: '100%', marginTop: 10 }]} onPress={() => { setDisplay('0'); setEquation(''); }}>
          <Text style={styles.calcBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<Tool>('dashboard');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        {view !== 'dashboard' && (
          <TouchableOpacity onPress={() => setView('dashboard')} style={styles.backBtn}>
            <ChevronLeft size={24} color="#1f2937" />
          </TouchableOpacity>
        )}
        <Text style={styles.navTitle}>Toolkit</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {view === 'dashboard' && <Dashboard onSelect={setView} />}
        {view === 'converter' && <UnitConverter />}
        {view === 'notes' && <Notes />}
        {view === 'calculator' && <Calculator />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  navbar: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    ...Platform.select({
      web: {
        position: 'sticky' as any,
        top: 0,
        zIndex: 10,
      }
    })
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  backBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  dashboardContainer: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  grid: {
    gap: 16,
  },
  toolCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  toolDesc: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
  toolView: {
    padding: 20,
    flex: 1,
  },
  toolHeader: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  resultBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  noteInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesList: {
    flex: 1,
  },
  noteCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  noteText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    marginRight: 12,
  },
  calcDisplay: {
    backgroundColor: '#1f2937',
    padding: 24,
    borderRadius: 16,
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  calcDisplayText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  calcEquationText: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 4,
  },
  calcGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  calcBtn: {
    width: (width - 60) / 4,
    height: (width - 60) / 4,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  calcBtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  }
});
