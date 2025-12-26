"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface CreateCollectionModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateCollectionModal({ onClose, onCreated }: CreateCollectionModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (response.ok) {
        onCreated();
        onClose();
      } else {
        alert("Failed to create collection");
      }
    } catch (error) {
      console.error('Create collection error:', error);
      alert("Failed to create collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="space-y-6">
        <h2 className="text-2xl font-serif text-bridal-charcoal">Create Collection</h2>
        <Input
          label="Collection Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Wedding Day, Sangeet Night"
        />
        <div className="flex gap-3">
          <Button onClick={handleCreate} loading={loading} disabled={!name.trim()}>
            Create
          </Button>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
