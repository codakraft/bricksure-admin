import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Edit, FileText, Image, User, Building, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { MakerCheckerModal } from '../../../components/common/MakerCheckerModal';
import { Application, FieldReview } from '../../../types/common';
import { useNotifications } from '../../../contexts/NotificationContext';

// Mock application data
const mockApplication: Application = {
  id: 'APP-2025-001',
  userId: 'user-123',
  userName: 'John Smith',
  userEmail: 'john.smith@email.com',
  propertyId: 'PROP-001',
  propertyAddress: '123 Victoria Street, Victoria Island, Lagos',
  applicationData: {
    personalInfo: {
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+234 801 234 5678',
      dateOfBirth: '1985-06-15',
      occupation: 'Software Engineer'
    },
    propertyInfo: {
      address: '123 Victoria Street, Victoria Island, Lagos',
      propertyType: 'Residential Building',
      constructionYear: '2018',
      constructionMaterial: 'Concrete Block',
      roofType: 'Aluminum Roofing Sheet',
      numberOfFloors: 2,
      estimatedValue: 50000000
    },
    coverageInfo: {
      coverageType: 'Comprehensive',
      sumInsured: 50000000,
      excess: 100000,
      riders: ['Flood Protection', 'Burglary Coverage']
    },
    documents: {
      propertyPhotos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
      identityDocument: 'national_id.pdf',
      proofOfOwnership: 'certificate_of_occupancy.pdf',
      valuationReport: 'valuation_report.pdf'
    }
  },
  status: 'submitted',
  submittedAt: '2025-01-27T10:30:00Z',
  premium: 45000
};

export function ApplicationDetail() {
  const { id } = useParams();
  const [application] = useState<Application>(mockApplication);
  const [fieldReviews, setFieldReviews] = useState<FieldReview[]>([]);
  const [showMakerChecker, setShowMakerChecker] = useState(false);
  const [pendingAction, setPendingAction] = useState<{action: string, data: any} | null>(null);
  const [overallComments, setOverallComments] = useState('');
  const { addNotification } = useNotifications();

  const handleFieldReview = (fieldName: string, fieldValue: any, status: 'approved' | 'rejected' | 'amended', comments: string, suggestedValue?: any) => {
    const existingReviewIndex = fieldReviews.findIndex(review => review.fieldName === fieldName);
    const newReview: FieldReview = {
      fieldName,
      fieldValue,
      status,
      comments,
      suggestedValue
    };

    if (existingReviewIndex >= 0) {
      const updatedReviews = [...fieldReviews];
      updatedReviews[existingReviewIndex] = newReview;
      setFieldReviews(updatedReviews);
    } else {
      setFieldReviews([...fieldReviews, newReview]);
    }
  };

  const handleApplicationAction = (action: 'approve' | 'reject' | 'amend') => {
    const actionData = {
      applicationId: application.id,
      action,
      fieldReviews,
      overallComments,
      premium: application.premium
    };

    setPendingAction({
      action: `Application ${action}`,
      data: actionData
    });
    setShowMakerChecker(true);
  };

  const handleMakerCheckerSubmit = () => {
    addNotification({
      type: 'success',
      title: 'Review Submitted',
      message: `Application review has been submitted for maker-checker approval.`
    });
    setPendingAction(null);
  };

  const getFieldStatus = (fieldName: string) => {
    const review = fieldReviews.find(r => r.fieldName === fieldName);
    return review?.status || 'pending';
  };

  const getFieldComments = (fieldName: string) => {
    const review = fieldReviews.find(r => r.fieldName === fieldName);
    return review?.comments || '';
  };

  const renderFieldReview = (fieldName: string, fieldValue: any, label: string) => {
    const status = getFieldStatus(fieldName);
    const comments = getFieldComments(fieldName);
    const [isEditing, setIsEditing] = useState(false);
    const [localComments, setLocalComments] = useState(comments);
    const [suggestedValue, setSuggestedValue] = useState('');

    const statusColors = {
      pending: 'border-gray-300',
      approved: 'border-green-300 bg-green-50',
      rejected: 'border-red-300 bg-red-50',
      amended: 'border-orange-300 bg-orange-50'
    };

    const statusIcons = {
      pending: null,
      approved: <CheckCircle className="w-4 h-4 text-green-600" />,
      rejected: <XCircle className="w-4 h-4 text-red-600" />,
      amended: <Edit className="w-4 h-4 text-orange-600" />
    };

    return (
      <div className={`border rounded-lg p-4 ${statusColors[status]}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <label className="font-medium text-gray-900 dark:text-white">{label}</label>
            {statusIcons[status]}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFieldReview(fieldName, fieldValue, 'approved', localComments)}
              className="text-green-600 hover:bg-green-50"
            >
              Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-orange-600 hover:bg-orange-50"
            >
              Amend
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFieldReview(fieldName, fieldValue, 'rejected', localComments)}
              className="text-red-600 hover:bg-red-50"
            >
              Reject
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-900 dark:text-white mb-2">
          <strong>Current Value:</strong> {typeof fieldValue === 'object' ? JSON.stringify(fieldValue) : String(fieldValue)}
        </div>

        {isEditing && (
          <div className="space-y-3 mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Suggested Value (for amendments)
              </label>
              <input
                type="text"
                value={suggestedValue}
                onChange={(e) => setSuggestedValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-600 dark:text-white text-sm"
                placeholder="Enter suggested value..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comments
              </label>
              <textarea
                value={localComments}
                onChange={(e) => setLocalComments(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-600 dark:text-white text-sm"
                placeholder="Add review comments..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleFieldReview(fieldName, fieldValue, 'amended', localComments, suggestedValue);
                  setIsEditing(false);
                }}
              >
                Save Review
              </Button>
            </div>
          </div>
        )}

        {comments && !isEditing && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm">
            <strong>Review Comments:</strong> {comments}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/applications">
            <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Applications
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Application Review</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {application.id} - {application.userName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={application.status as any} />
          <div className="flex items-center space-x-2">
            <Button
              variant="danger"
              icon={<XCircle className="w-4 h-4" />}
              onClick={() => handleApplicationAction('reject')}
            >
              Reject
            </Button>
            <Button
              variant="secondary"
              icon={<Edit className="w-4 h-4" />}
              onClick={() => handleApplicationAction('amend')}
            >
              Request Amendment
            </Button>
            <Button
              icon={<CheckCircle className="w-4 h-4" />}
              onClick={() => handleApplicationAction('approve')}
            >
              Approve
            </Button>
          </div>
        </div>
      </div>

      {/* Application Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Submitted</label>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date(application.submittedAt).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Sum Insured</label>
            <p className="font-medium text-gray-900 dark:text-white">
              ₦{application.applicationData.coverageInfo.sumInsured.toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Calculated Premium</label>
            <p className="font-medium text-gray-900 dark:text-white">
              ₦{application.premium?.toLocaleString() || 'TBD'}
            </p>
          </div>
        </div>
      </div>

      {/* Field-by-Field Review */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
          </div>
          <div className="space-y-4">
            {renderFieldReview('personalInfo.fullName', application.applicationData.personalInfo.fullName, 'Full Name')}
            {renderFieldReview('personalInfo.email', application.applicationData.personalInfo.email, 'Email')}
            {renderFieldReview('personalInfo.phone', application.applicationData.personalInfo.phone, 'Phone')}
            {renderFieldReview('personalInfo.dateOfBirth', application.applicationData.personalInfo.dateOfBirth, 'Date of Birth')}
            {renderFieldReview('personalInfo.occupation', application.applicationData.personalInfo.occupation, 'Occupation')}
          </div>
        </div>

        {/* Property Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Building className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Property Information</h3>
          </div>
          <div className="space-y-4">
            {renderFieldReview('propertyInfo.address', application.applicationData.propertyInfo.address, 'Address')}
            {renderFieldReview('propertyInfo.propertyType', application.applicationData.propertyInfo.propertyType, 'Property Type')}
            {renderFieldReview('propertyInfo.constructionYear', application.applicationData.propertyInfo.constructionYear, 'Construction Year')}
            {renderFieldReview('propertyInfo.constructionMaterial', application.applicationData.propertyInfo.constructionMaterial, 'Construction Material')}
            {renderFieldReview('propertyInfo.estimatedValue', application.applicationData.propertyInfo.estimatedValue, 'Estimated Value')}
          </div>
        </div>

        {/* Coverage Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Coverage Information</h3>
          </div>
          <div className="space-y-4">
            {renderFieldReview('coverageInfo.coverageType', application.applicationData.coverageInfo.coverageType, 'Coverage Type')}
            {renderFieldReview('coverageInfo.sumInsured', application.applicationData.coverageInfo.sumInsured, 'Sum Insured')}
            {renderFieldReview('coverageInfo.excess', application.applicationData.coverageInfo.excess, 'Excess')}
            {renderFieldReview('coverageInfo.riders', application.applicationData.coverageInfo.riders, 'Riders')}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Documents</h3>
          </div>
          <div className="space-y-4">
            {renderFieldReview('documents.identityDocument', application.applicationData.documents.identityDocument, 'Identity Document')}
            {renderFieldReview('documents.proofOfOwnership', application.applicationData.documents.proofOfOwnership, 'Proof of Ownership')}
            {renderFieldReview('documents.propertyPhotos', application.applicationData.documents.propertyPhotos, 'Property Photos')}
            {application.applicationData.documents.valuationReport && 
              renderFieldReview('documents.valuationReport', application.applicationData.documents.valuationReport, 'Valuation Report')
            }
          </div>
        </div>
      </div>

      {/* Overall Review Comments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Review Comments</h3>
        <textarea
          value={overallComments}
          onChange={(e) => setOverallComments(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
          placeholder="Add overall comments about this application..."
        />
      </div>

      {/* Review Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Review Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {fieldReviews.filter(r => r.status === 'approved').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Approved Fields</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {fieldReviews.filter(r => r.status === 'amended').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Amended Fields</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {fieldReviews.filter(r => r.status === 'rejected').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rejected Fields</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {Object.keys(application.applicationData).reduce((total, section) => {
                return total + Object.keys(application.applicationData[section as keyof typeof application.applicationData]).length;
              }, 0) - fieldReviews.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Review</p>
          </div>
        </div>

        {fieldReviews.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Field Reviews:</h4>
            <div className="space-y-2">
              {fieldReviews.map((review, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-900 dark:text-white">{review.fieldName}</span>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={review.status as any} />
                    {review.comments && (
                      <span className="text-xs text-gray-500 dark:text-gray-400" title={review.comments}>
                        Has comments
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Maker-Checker Modal */}
      {showMakerChecker && pendingAction && (
        <MakerCheckerModal
          isOpen={showMakerChecker}
          onClose={() => setShowMakerChecker(false)}
          action={pendingAction.action}
          entityType="Application"
          entityId={application.id}
          data={pendingAction.data}
          riskLevel="high"
          onSubmit={handleMakerCheckerSubmit}
        />
      )}
    </div>
  );
}