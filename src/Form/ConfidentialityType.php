<?php

namespace App\Form;

use App\Entity\Confidentiality;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class ConfidentialityType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('notifIsActive', CheckboxType::class,['attr' => ['class' => 'form-check-input'],'label' => false,'required' => false])
            ->add('profil', ChoiceType::class, 
            [
                'choices'  => [
                    'Publique' => 1,
                    'Ami(e)s' => 2,
                    'Moi uniquement' => 3,
                ],
                'label' => false,
            ])
            ->add('email', ChoiceType::class,
            [
                'choices'  => [
                    'Publique' => 1,
                    'Ami(e)s' => 2,
                    'Moi uniquement' => 3,
                ],
                'label' => false,
            ])
            ->add('amie', ChoiceType::class,
            [
                'choices'  => [
                    'Publique' => 1,
                    'Ami(e)s' => 2,
                    'Moi uniquement' => 3,
                ],
                'label' => false,
            ])
            ->add('publication', ChoiceType::class,
            [
                'choices'  => [
                    'Publique' => 1,
                    'Ami(e)s' => 2,
                    'Moi uniquement' => 3,
                ],
                'label' => false,
            ])
            ->add('invitation', ChoiceType::class,
            [
                'choices'  => [
                    'Publique' => 1,
                    'Ami(e)s' => 2,
                    'Moi uniquement' => 3,
                ],
                'label' => false
            ])
            ->add('submit', SubmitType::class, ['attr' => ['class' => 'btn btn-sm btn-primary w-100'], ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Confidentiality::class,
        ]);
    }
}
