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


class MixtePublicationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $isHasTribuT=  (count($options['data']['tribuTList']) > 0 ) ?  true : false ;
        $tribuTList= $options['data']['tribuTList'];
        $builder
            ->add('legend', TextareaType::class, ['label' => false, 'required' => false])
            ->add('photo', FileType::class, [
                'label' => false,
                'required' => false,
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
            ->add('confidentiality', ChoiceType::class,[
                'choices'  => [
                    'Tous le monde' => 1,
                    'Moi uniquement' => 0,
                ],
                'label' => false,
            ])
            ->add('type', ChoiceType::class,[
                'choices'  => [
                    "Tribu G" => "Tribu G",
                    "Tribu T" => "Tribu T",
                ],
                'label' => false,
            ])
            ->add('tribu', ChoiceType::class,[
                'choices'  => $tribuTList,
                'label' => false,
            ])
            ->add('infoTribuT', TextareaType::class, [
                'data' => "Impossible car vous n'avez pas encore créer ou de rejoindre un tribu T.",
                'disabled' => true,
                'required' => false
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            //data_class' => CommentG::class,
        ]);
    }
}
