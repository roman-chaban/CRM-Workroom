import React, { ChangeEvent, FormEvent, FC } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';

import { Container, Input, SignInNav } from '@/index/index';

import Select, { SingleValue } from 'react-select';

import { ServiceOption } from '@/interfaces/ServicesSelectInterface';
import { serviceBusinessOptions } from '@/static/ServiceBusiness';
import { ServiceDetailsFormButtons } from './ServiceDetailsFormButtons';
import { ServicesDetails } from '@/types/ServicesDetailsTypes';
import { getServicesDetails } from '@/api/services';

import toast from 'react-hot-toast';

import {
  setCompanyName,
  setSelectedBusinessDirection,
} from '@/store/slices/ServiceDetailsSlice';

import { ServiceDetailsFormProps } from '@/interfaces/ServiceDetailsInterface';

import customStyles from '@/styles/selectsStyles/ServiceSelectStyles';

import styles from './ServiceDetails.module.scss';
import { Form } from '@/components/shared-ui/Form/Form';
import { Label } from '@/components/shared-ui/Label/Label';

export const ServiceDetailsForm: FC<ServiceDetailsFormProps> = ({
  currentStep,
}) => {
  const dispatch = useAppDispatch();

  const { companyName, selectedTeamSize, selectedBusinessDirection } =
    useAppSelector((state) => state.serviceDetails);

  const handleCompanyNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setCompanyName(event.target.value));
  };

  const handleBusinessDirectionChange = (
    selectedOption: SingleValue<ServiceOption>,
  ) => {
    if (selectedOption) {
      dispatch(setSelectedBusinessDirection(selectedOption));
    }
  };

  const submitServiceDetailsMutation = useMutation({
    mutationFn: getServicesDetails,
    onSuccess: () => {
      toast.success('Service details successfully saved.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save service details: ${error.message}`);
    },
  });

  const handleServiceDetailsFormSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!companyName || !selectedTeamSize || !selectedBusinessDirection) {
      toast.error('Please fill in all the required fields.');
      return;
    }

    const existingServiceDetails = JSON.parse(
      localStorage.getItem('service-details') || '{}',
    );

    const updatedServiceDetails = {
      ...existingServiceDetails,
      companyName,
      businessDirection: selectedBusinessDirection.value,
      teamPeopleRange: selectedTeamSize,
    };

    try {
      localStorage.setItem(
        'service-details',
        JSON.stringify(updatedServiceDetails),
      );
      toast.success('Service details saved successfully.');
    } catch (error) {
      console.error('Failed to save service details to localStorage:', error);
      toast.error('An error occurred while saving.');
    }

    const serviceDetails: ServicesDetails = {
      usagePurpose: existingServiceDetails.usagePurpose || '',
      personBestDescriptor: existingServiceDetails.personBestDescriptor || '',
      companyName,
      businessDirection: selectedBusinessDirection.value,
      teamPeopleRange: selectedTeamSize,
    };

    submitServiceDetailsMutation.mutate(serviceDetails);
  };

  const isNextStepDisabled =
    !companyName || !selectedTeamSize || !selectedBusinessDirection;

  return (
    <Form
      className={styles['serviceDetailsForm']}
      onSubmit={handleServiceDetailsFormSubmit}
    >
      <Container className={styles['serviceDetailsFormMain']}>
        <Input
          htmlFor="companyName"
          label="Company Name"
          name="companyName"
          id="companyName"
          placeholder="Enter your company's name"
          type="text"
          classNames={{
            input: styles['serviceDetailsInput'],
            container: styles['serviceDetailsInputContainer'],
            label: styles['serviceDetailsLabel'],
          }}
          value={companyName}
          onChange={handleCompanyNameChange}
        />

        <Label className={styles['businessDirectionLabel']}>
          Business Direction
          <Select
            styles={customStyles}
            options={serviceBusinessOptions}
            value={selectedBusinessDirection}
            onChange={handleBusinessDirectionChange}
          />
        </Label>

        <ServiceDetailsFormButtons selectedTeamSize={selectedTeamSize} />
      </Container>

      <SignInNav
        currentStep={currentStep}
        isNextButtonDisabled={isNextStepDisabled}
        classNames={{
          container: styles['multiStepsFooter'],
          nextBtn: styles['multiStepsNextButton'],
          prevBtn: styles['multiStepsPreviousButton'],
        }}
      />
    </Form>
  );
};
