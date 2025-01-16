import { Schema, model } from 'mongoose';

const CertificateSchema = new Schema(
  {
    name: { type: String },
    image: { type: String },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const CertificateModal = model('Certificate', CertificateSchema);

export default CertificateModal;

export const CertificateMethods = {
  getCertificates: () => CertificateModal.find(),
  getCertificateById: (id: string) => CertificateModal.findById({ _id: id }),
  getCertificateByName: (name: string) => CertificateModal.findOne({ name }),
  getCertificatesBySearch: (query: string) =>
    CertificateModal.find({
      $or: [{ name: { $regex: query, $options: 'i' } }],
    }),
  createCertificate: (values: Record<string, any>) =>
    new CertificateModal(values).save().then((value) => value.toObject()),
  deleteCertificateById: (id: string) => CertificateModal.findByIdAndDelete({ _id: id }),
  updateCertificateById: (id: string): any => CertificateModal.findByIdAndUpdate({ _id: id }),
};
