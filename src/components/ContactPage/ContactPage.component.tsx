import { ContactForm } from "src/components/ContactForm/ContactForm.component";

export const ContactPage = () => {
  return (
    <div className="container column">
      <header className="page-header">
        <h1>Contact us</h1>
        <p className="subtitle">
          Send us your contact info and we will get back to you within 24-48
          hours.
        </p>
      </header>
      <ContactForm />
    </div>
  );
};