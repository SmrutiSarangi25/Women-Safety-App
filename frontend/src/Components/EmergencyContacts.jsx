import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../Context/AuthContext';
import api from '../../API/CustomApi';
import { Config } from '../../API/Config';
import { toast } from 'react-toastify';

function EmergencyContacts() {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await api.get(Config.EMERGENCY_CONTACTS_URL);
      setContacts(response.data.contacts || []);
    } catch {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post(Config.EMERGENCY_CONTACTS_URL, {
        name: data.name,
        phone: data.MobileNo,
        email: data.email || ''
      });
      if (response.status === 201 && response.data) {
        setContacts((prev) => [...prev, response.data.contact]);
        toast.success('Contact added!');
        reset();
      }
    } catch {
      toast.error('Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    setLoading(true);
    try {
      await api.delete(`${Config.EMERGENCY_CONTACTS_URL}/${contactId}`);
      setContacts((prev) => prev.filter((c) => c._id !== contactId));
      toast.success('Contact deleted');
    } catch {
      toast.error('Failed to delete contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Emergency Contacts</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 flex flex-col gap-3">
        <input type="text" {...register('name', { required: true })} placeholder="Name" className="border p-2 rounded" />
        <input type="text" {...register('MobileNo', { required: true })} placeholder="Mobile Number" className="border p-2 rounded" />
        <input type="email" {...register('email')} placeholder="Email (optional)" className="border p-2 rounded" />
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Adding...' : 'Add Contact'}
        </button>
      </form>
      <h3 className="font-semibold mb-2">Your Contacts</h3>
      <ul className="space-y-2">
        {contacts.map((contact) => (
          <li key={contact._id} className="flex items-center justify-between bg-gray-50 p-2 rounded shadow">
            <div className="flex items-center gap-3">
              <div>
                <div className="font-bold">{contact.name}</div>
                <div className="text-xs text-gray-600">{contact.phone}</div>
                {contact.email && <div className="text-xs text-gray-400">{contact.email}</div>}
              </div>
            </div>
            <button onClick={() => handleDelete(contact._id)} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
          </li>
        ))}
        {contacts.length === 0 && <li className="text-gray-400">No contacts added yet.</li>}
      </ul>
    </div>
  );
}

export default EmergencyContacts;
