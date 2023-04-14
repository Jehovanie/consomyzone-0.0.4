<?php

namespace App\Form;

use App\Entity\CommentG;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Validator\Constraints\File;


class PublicationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('legend', TextareaType::class, ['label' => false, 'required' => false])
            ->add('photo', FileType::class, [
                'label' => false, 'required' => false,
                'constraints' => [
                    new File([
                        'maxSize' => '5024k',
                        'mimeTypes' => [
                            'image/jpeg',
                            'image/jpg',
                            'image/png'
                        ],
                        'mimeTypesMessage' => 'Choisir un fichier image !',
                    ])
                ],
                ])
            ->add('confidentiality', ChoiceType::class, 
            [
                'choices'  => [
                    'Publique' => 1,
                    'Ami(e)s' => 2,
                    'Moi uniquement' => 3,
                ],
                'label' => false,
            ])
        /*->add('user_id', HiddenType::class)
        ->add('tributg_id', HiddenType::class)*/
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            //data_class' => CommentG::class,
        ]);
    }
}
