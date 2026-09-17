import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/api";

export default function ContactForm({ username }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();
  const [status, setStatus] = useState(null);

  const onSubmit = async (data) => {
    setStatus(null);
    try {
      const { data: res } = await api.post(`/contact/${username}`, data);
      setStatus({ ok: true, message: res.message });
      reset();
    } catch (err) {
      setStatus({
        ok: false,
        message: err?.response?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <section className="contact-form-wrap">
      <h2>Get in touch</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Your name"
          {...register("name", { required: true })}
        />
        <input
          placeholder="Your email"
          type="email"
          {...register("email", { required: true })}
        />
        <textarea
          placeholder="Message"
          rows={4}
          {...register("message", { required: true })}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
      </form>
      {status && (
        <p className={status.ok ? "server-success" : "server-error"}>
          {status.message}
        </p>
      )}
    </section>
  );
}
