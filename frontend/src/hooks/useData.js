import { useState, useEffect } from 'react';
import API from '../config/api';

export function useReports(page = 1, limit = 10, type = '') {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/reports?page=${page}&limit=${limit}${type ? `&reportType=${type}` : ''}`);
        setReports(data.reports);
        setTotal(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [page, limit, type]);

  return { reports, total, loading };
}

export function useMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async () => {
    try {
      const { data } = await API.get('/medicines');
      setMedicines(data.medicines);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicines(); }, []);

  return { medicines, loading, refetch: fetchMedicines };
}

export function useAppointments(status = '') {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await API.get(`/appointments${status ? `?status=${status}` : ''}`);
        setAppointments(data.appointments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [status]);

  return { appointments, loading };
}

export function useHealthScore() {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const { data } = await API.get('/health/score');
        setScore(data.healthScore);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  return { score, loading };
}
