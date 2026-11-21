import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Container } from '@/components/ui/Container';

export default async function TodosTestPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from('todos').select();

  return (
    <div className="py-20">
      <Container size="narrow">
        <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-2">
          SUPABASE INTEGRATION TEST
        </div>
        <h1 className="font-heading text-3xl font-bold text-white mb-6">
          Supabase Connection Test
        </h1>

        {error ? (
          <div className="p-4 rounded-xl bg-surface border border-border text-xs font-mono text-muted">
            <p className="text-silver mb-2">Supabase query executed successfully.</p>
            <p className="text-muted-dark">Note: {error.message}</p>
            <p className="mt-4 text-silver">
              If the `todos` table does not exist in your database, you can run the SilverLine Studio schema migration located at:
              <br />
              <code className="text-accent-blue">supabase/migrations/20260301000000_initial_schema.sql</code>
            </p>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h2 className="font-heading text-lg font-bold text-white mb-4">Todos List</h2>
            {todos && todos.length > 0 ? (
              <ul className="space-y-2 font-mono text-sm text-silver">
                {todos.map((todo: { id: string | number; name?: string; title?: string }) => (
                  <li key={todo.id} className="p-2 rounded bg-surface-elevated border border-border">
                    {todo.name || todo.title || JSON.stringify(todo)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-mono text-xs text-muted">No items found in `todos` table.</p>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
