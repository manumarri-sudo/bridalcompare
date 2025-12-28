import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface OnboardingRequest {
  userId: string;
  role: 'shopper' | 'bride' | 'groom' | 'guest' | 'stylist';
  cultureMix: string[];
}

interface CollectionTemplate {
  title: string;
  eventContext: string;
  description: string;
  cultures: string[];
}

const COLLECTION_TEMPLATES: CollectionTemplate[] = [
  { title: 'Pellikuthuru', eventContext: 'haldi', description: 'Telugu pre-wedding ceremony', cultures: ['telugu'] },
  { title: 'Snanam Ceremony', eventContext: 'haldi', description: 'Telugu cleansing ritual', cultures: ['telugu'] },
  { title: 'Chooda Ceremony', eventContext: 'mehendi', description: 'Punjabi bangles ceremony', cultures: ['punjabi'] },
  { title: 'Jaggo Night', eventContext: 'sangeet', description: 'Punjabi pre-wedding celebration', cultures: ['punjabi'] },
  { title: 'Gaye Holud', eventContext: 'haldi', description: 'Bengali turmeric ceremony', cultures: ['bengali'] },
  { title: 'Bou Bhat', eventContext: 'reception', description: 'Bengali reception', cultures: ['bengali'] },
  { title: 'Nichayathartam', eventContext: 'engagement', description: 'Tamil engagement', cultures: ['tamil'] },
  { title: 'Nalangu', eventContext: 'haldi', description: 'Tamil cleansing ceremony', cultures: ['tamil'] },
  { title: 'Pithi Ceremony', eventContext: 'haldi', description: 'Gujarati turmeric ceremony', cultures: ['gujarati'] },
  { title: 'Garba Night', eventContext: 'sangeet', description: 'Gujarati dance celebration', cultures: ['gujarati'] },
  { title: 'Nikah', eventContext: 'wedding_ceremony', description: 'Islamic wedding ceremony', cultures: ['muslim'] },
  { title: 'Walima', eventContext: 'reception', description: 'Islamic reception', cultures: ['muslim'] },
  { title: 'Mehndi Night', eventContext: 'mehendi', description: 'Henna ceremony', cultures: ['muslim'] },
  { title: 'Church Ceremony', eventContext: 'wedding_ceremony', description: 'Christian wedding', cultures: ['christian'] },
  { title: 'Wedding Breakfast', eventContext: 'reception', description: 'Christian reception', cultures: ['christian'] },
  { title: 'Sangeet', eventContext: 'sangeet', description: 'Pre-wedding music & dance celebration', cultures: ['universal'] },
  { title: 'Mehendi', eventContext: 'mehendi', description: 'Henna ceremony', cultures: ['universal'] },
  { title: 'Haldi', eventContext: 'haldi', description: 'Turmeric ceremony', cultures: ['universal'] },
  { title: 'Reception', eventContext: 'reception', description: 'Wedding reception', cultures: ['universal'] },
  { title: 'Engagement Party', eventContext: 'engagement', description: 'Engagement celebration', cultures: ['universal'] },
  { title: 'Wedding Guest Outfits', eventContext: 'guest_fit', description: 'Outfits as a wedding guest', cultures: ['universal'] },
  { title: 'Diwali Collection', eventContext: 'diwali', description: 'Festival of Lights outfits', cultures: ['universal'] },
  { title: 'Eid Collection', eventContext: 'eid', description: 'Eid celebration outfits', cultures: ['universal'] },
];

export async function POST(request: NextRequest) {
  try {
    const { userId, role, cultureMix }: OnboardingRequest = await request.json();

    if (!userId || !role || !cultureMix || !Array.isArray(cultureMix)) {
      return NextResponse.json(
        { error: 'Invalid onboarding data' },
        { status: 400 }
      );
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role, culture_mix: cultureMix })
      .eq('id', userId);

    if (profileError) throw profileError;

    const collectionsToCreate: any[] = [];
    const createdTitles = new Set<string>();

    const addCollection = (template: CollectionTemplate) => {
      if (!createdTitles.has(template.title)) {
        collectionsToCreate.push({
          user_id: userId,
          title: template.title,
          description: template.description,
          event_context: template.eventContext,
          is_system_generated: true,
        });
        createdTitles.add(template.title);
      }
    };

    for (const culture of cultureMix) {
      const cultureLower = culture.toLowerCase();
      const relevantTemplates = COLLECTION_TEMPLATES.filter(t => 
        t.cultures.includes(cultureLower)
      );
      relevantTemplates.forEach(addCollection);
    }

    const universalTemplates = COLLECTION_TEMPLATES.filter(t => 
      t.cultures.includes('universal')
    );
    universalTemplates.forEach(addCollection);

    if (role === 'guest') {
      const guestTemplates = COLLECTION_TEMPLATES.filter(t => 
        t.eventContext === 'guest_fit' || t.eventContext === 'diwali' || t.eventContext === 'eid'
      );
      guestTemplates.forEach(addCollection);
    }

    if (collectionsToCreate.length > 0) {
      const { data: collections, error: insertError } = await supabase
        .from('collections')
        .insert(collectionsToCreate)
        .select();

      if (insertError) throw insertError;

      return NextResponse.json({
        success: true,
        message: `Created ${collections?.length || 0} collections`,
        collections,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated, no collections created',
    });

  } catch (error: any) {
    console.error('❌ Onboarding Error:', error);
    return NextResponse.json(
      { error: error.message || 'Onboarding failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, culture_mix, is_vara_pass_holder, usage_count')
      .eq('id', userId)
      .single();

    if (error) throw error;

    const isOnboarded = profile.role && profile.culture_mix && profile.culture_mix.length > 0;

    return NextResponse.json({
      success: true,
      profile,
      isOnboarded,
    });

  } catch (error: any) {
    console.error('❌ Get Profile Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
