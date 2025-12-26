"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";
import CreateCollectionModal from "./CreateCollectionModal";

interface SaveToCollectionModalProps {
  productId: string;
  onClose: () => void;
}

export default function SaveToCollectionModal({ productId, onClose }: SaveToCollectionModalProps) {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const supabase = createClient();

  const loadCollections = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });
    setCollections(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleSave = async (collectionId: string) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        alert("Saved to collection!");
        onClose();
      } else if (response.status === 409) {
        alert("This item is already in that collection");
      } else {
        alert("Failed to save item");
      }
    } catch (error) {
      console.error('Save error:', error);
      alert("Failed to save item");
    }
  };

  return (
    <>
      <Modal onClose={onClose}>
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-bridal-charcoal">Save to Collection</h2>
          
          {loading ? (
            <p className="text-bridal-charcoal/70">Loading collections...</p>
          ) : collections.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleSave(collection.id)}
                  className="w-full text-left p-4 rounded-lg border border-bridal-mauve/30 hover:border-bridal-gold hover:bg-bridal-gold/5 transition-colors"
                >
                  {collection.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-bridal-charcoal/70">No collections yet. Create one below!</p>
          )}

          <Button
            onClick={() => setShowCreateModal(true)}
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Collection
          </Button>
        </div>
      </Modal>

      {showCreateModal && (
        <CreateCollectionModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadCollections();
          }}
        />
      )}
    </>
  );
}
