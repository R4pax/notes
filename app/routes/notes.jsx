import { json, redirect } from "@remix-run/node";
import { useActionData, useCatch, useLoaderData } from "@remix-run/react";

import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "../components/NoteList";
import { getStoredNotes, storeNotes } from "../data/notes";

export default function NotesPage() {
  // данные с функции loader попадают в хук
  const notes = useLoaderData();
  // данные с action на странице notes попадают в хук (у нас в случае ошибки)
  // const data = useActionData(); .. перенесли в NewNotes
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  // срабатывает при загрузке страницы
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    // попадет в CatchBoundary
    throw json(
      { message: "Could not find any notes." },
      { status: 404, statusText: "Not Found" }
    );
  }
  return notes;
  // аналогично
  // return new Response(JSON.stringify(notes), {
  //   headers: { "Content-Type": "application/json" },
  // });
  // аналогично
  // return (json(notes)) чет криво записал может и не так
}

export async function action({ request }) {
  // срабатывает при экшене на этот роут, например при пост запросе
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  if (noteData.title.trim().length < 5) {
    return { message: "Invalid Title" };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  // возвращает куда редиректнуться по завершению функции
  return redirect("/notes");
}

// тут определяем мета теги для страницы
export const meta = () => ({
  title: "Notes",
});

// тут подключаем стили для страницы
export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

// ловит респонс с ошибкой
export function CatchBoundary() {
  const caughtResponse = useCatch();
  const message = caughtResponse.data?.message || "Data not found";

  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  );
}

// страничка которая показывает ошибку вместо дефолтной, если чето на беке сломалось
// можно делать для каждой странички свой обработчик а можно в руте ловить все ошибки
export function ErrorBoundary({ error }) {
  return (
    <main className="error">
      <h1>An Error occured!</h1>
      <p>{error.message}</p>
    </main>
  );
}
