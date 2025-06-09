const Scholarship = require('../models/Scholarship');

const createScholarship = async (req, res) => {
  try {
    const { title, amount, deadline, cgpiCriteria, provider, location, specialisation } = req.body;

    if (!title || !amount || !deadline || !cgpiCriteria || !provider || !location || !specialisation) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    const newScholarship = await Scholarship.create({
      title,
      amount,
      deadline,
      cgpiCriteria,
      provider,
      location,
      specialisation,
    });

    res.status(201).json(newScholarship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error during scholarship creation' });
  }
};


const parseCgpiCriteria = (criteriaString) => {
  const match = criteriaString.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
};

const getScholarships = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { adminApproved: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } },
        { cgpiCriteria: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { specialisation: { $regex: search, $options: 'i' } },
      ];
    }

    const scholarships = await Scholarship.find(query).sort({ createdAt: -1 });
    res.status(200).json(scholarships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error during fetching scholarships' });
  }
};


const getEligibleScholarships = async (req, res) => {
  try {
    const userCgpi = req.user.cgpi;
    const userSpecialization = req.user.specialization || req.user.specialisation;

    let queryConditions = { adminApproved: true };
    let userSpecificOrConditions = [];

    if (userSpecialization) {
      userSpecificOrConditions.push({ specialisation: { $regex: userSpecialization, $options: 'i' } });
    }

    if (userSpecificOrConditions.length > 0) {
      queryConditions.$or = userSpecificOrConditions;
    }

    let eligibleScholarships = await Scholarship.find(queryConditions).sort({ createdAt: -1 });

    if (userCgpi !== undefined && userCgpi !== null) {
      eligibleScholarships = eligibleScholarships.filter((scholarship) => {
        const requiredCgpi = parseCgpiCriteria(scholarship.cgpiCriteria);
        return requiredCgpi === null || userCgpi >= requiredCgpi;
      });
    }

    res.status(200).json(eligibleScholarships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error during fetching eligible scholarships' });
  }
};


const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship || !scholarship.adminApproved) {
      return res.status(404).json({ msg: 'Scholarship not found or not approved' });
    }

    res.status(200).json(scholarship);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Scholarship not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateScholarship = async (req, res) => {
  try {
    let scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ msg: 'Scholarship not found' });
    }

    scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(scholarship);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Scholarship not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ msg: 'Scholarship not found' });
    }

    await Scholarship.deleteOne({ _id: req.params.id });

    res.status(200).json({ msg: 'Scholarship removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Scholarship not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createScholarship,
  getScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  getEligibleScholarships,
};