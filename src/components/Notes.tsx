import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Note } from '@/src/types';
import { Plus, Trash2, Edit3, Search, StickyNote, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Notes() {
  const [notes, setNotes] = React.useState<Note[]>(() => {
    const saved = localStorage.getItem('utility-toolkit-notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = React.useState('');
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<Note | null>(null);
  const [newNote, setNewNote] = React.useState({ title: '', content: '' });

  React.useEffect(() => {
    localStorage.setItem('utility-toolkit-notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title || 'Untitled Note',
      content: newNote.content,
      createdAt: Date.now(),
    };
    
    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '' });
    setIsAddOpen(false);
  };

  const handleUpdateNote = () => {
    if (!editingNote) return;
    setNotes(notes.map(n => n.id === editingNote.id ? editingNote : n));
    setEditingNote(null);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card/50"
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <textarea
                  className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Start typing..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddNote}>Save Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group hover:shadow-md transition-all border-none bg-card/50 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingNote(note)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      <Calendar className="w-3 h-3" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                      {note.content || <span className="italic opacity-50">No content</span>}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <StickyNote className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No notes found</p>
            <p className="text-sm">Create your first note to get started</p>
          </div>
        )}
      </ScrollArea>

      {/* Edit Dialog */}
      <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <textarea
                  className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNote(null)}>Cancel</Button>
            <Button onClick={handleUpdateNote}>Update Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
