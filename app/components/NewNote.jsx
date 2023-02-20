import {
  Form,
  useActionData,
  useTransition as useNavigation,
} from "@remix-run/react";
import styles from "./NewNote.css";

function NewNote() {
  const navigation = useNavigation();
  // данные с action на странице notes попадают в хук (у нас в случае ошибки)
  const data = useActionData();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" id="note-form">
      {data?.message && <p>{data.message}</p>}
      <p>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
      </p>
      <p>
        <label htmlFor=""></label>
        <textarea id="content" name="content" required rows="5" />
      </p>
      <div className="form-actions">
        <button disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Note"}
        </button>
      </div>
    </Form>
  );
}

export default NewNote;

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
