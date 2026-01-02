import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function InboxPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: items } = await supabase
    .from('saved_items')
    .select('id, created_at, products(id, url, title, image_url, price_number, currency, designer, source_domain)')
    .eq('user_id', user.id)
    .is('collection_id', null)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/collections" className="text-orange-600 hover:underline mb-4 inline-block">
          Back to Collections
        </Link>
        <h1 className="text-3xl font-bold mb-2">Inbox</h1>
        <p className="text-gray-600 mb-6">{items?.length || 0} items saved</p>
        {!items || items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No items yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item: any) => {
              const product = item.products
              if (!product) return null
              return (
                <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative h-64 bg-gray-100">
                    <Image src={product.image_url || 'https://placehold.co/600x400'} alt={product.title || 'Product'} fill className="object-cover" unoptimized />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{product.title || 'Saved Item'}</h3>
                    <p className="text-xs text-gray-500 mb-2">{product.designer}</p>
                    {product.price_number > 0 && <p className="font-bold text-orange-600">{product.currency} {product.price_number}</p>}
                    <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">View on site</a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
